import type { OpenAPIV3 } from 'openapi-types'
import {
  Collection,
  CollectionTypeEnum,
  Environment,
  EnvParameters,
  ImportProjectDto
} from '../../../shared/src/types/pcAPI'
import { getDataType } from '../../../shared/src/utils/is'
import { safeStringify } from '../../../shared/src/utils/common'
import {
  ApiParamsType,
  ContentType,
  Protocol,
  RequestMethod
} from '../../../shared/src/types/api.model'
import { Group } from '../../../shared/src/types/group'
import {
  ApiData,
  BodyParam,
  HeaderParam
} from '../../../shared/src/types/apiData'

export const contentTypeMap = new Map([
  ['application/json', ContentType.JSON_OBJECT],
  ['application/xml', ContentType.XML],
  ['application/x-www-form-urlencode', ContentType.FROM_DATA],
  ['multipart/form-data', ContentType.BINARY],
  ['text/plain', ContentType.RAW]
] as const)

const contentTypeMapKeys = [...contentTypeMap.keys()]
type ContentTypeMapKey  = (typeof contentTypeMapKeys)[number]

export const parametersInMap = new Map([
  ['query', 'queryParams'],
  ['path', 'restParams'],
  ['header', 'headerParams']
])

const typeMap = {
  integer: 'int'
}

const mui = {
  header: 0,
  body: 1,
  query: 2,
  path: 3
}

const formatType = (type: string) => {
  return typeMap[type] || type
}

export class OpenAPIParser {
  data: ImportProjectDto
  openAPI: OpenAPIV3.Document
  groups: { [name: string]: Group } = {}
  apiDatas: ApiData[] = []
  environments: Environment[] = []
  structMap = new Map<string, OpenAPIV3.SchemaObject>()
  propertiesMap = new Map()

  constructor(openAPI: OpenAPIV3.Document) {
    this.openAPI = openAPI
    const { info, tags, servers, paths, components } = openAPI

    // 生成数据结构体
    this.generateCompSchemas(components)
    // 生成分组
    this.generateGroups(tags)
    // 生成API
    this.generateApiDatas(paths)
    // 生成环境
    this.generateEnvironments(servers)

    this.data = {
      collections: [
        {
          name: info.title || 'Import openapi collection',
          collectionType: CollectionTypeEnum.GROUP,
          children: [...Object.values(this.groups), ...this.apiDatas]
        }
      ],
      environmentList: this.environments
    }
  }

  generateCompSchemas(components?: OpenAPIV3.ComponentsObject) {
    if (components?.schemas) {
      Object.entries(components.schemas).forEach(([key, value]) => {
        this.structMap.set(key, value as OpenAPIV3.SchemaObject)
      })
    }
  }

  generateEnvironments = (servers: OpenAPIV3.ServerObject[] = []) => {
    if (servers && Array.isArray(servers) && servers.length) {
      servers.forEach((n) => {
        const targetEnv = this.environments.find(
          (m) => m.hostUri === n.url
        ) || {
          hostUri: n.url,
          name: n.description,
          parameters: [] as EnvParameters[]
        }

        if (n.variables) {
          Object.entries(n.variables).forEach(([key, val]) => {
            targetEnv.parameters?.push({
              name: key,
              value: val.default || val.enum?.at(0) || ''
            })
          })
        }
      })
    }
  }

  generateGroups(
    tags: OpenAPIV3.TagObject[] | OpenAPIV3.OperationObject['tags'] = []
  ) {
    return tags?.reduce<typeof this.groups>((prev, curr) => {
      if (typeof curr === 'string') {
        prev[curr] ??= { name: curr, collectionType: CollectionTypeEnum.GROUP, children: [] }
      } else {
        prev[curr.name] ??= { name: curr.name, collectionType: CollectionTypeEnum.GROUP, children: [] }
      }
      return prev
    }, this.groups)
  }

  generateApiDatas(paths: OpenAPIV3.PathsObject): ApiData[] {
    return Object.entries(paths).reduce((prev, [path, pathItemObj]) => {
      if (pathItemObj) {
        Object.entries(pathItemObj).forEach(([method, operationObject]) => {
          if (method.toUpperCase() in RequestMethod) {
            const obj = operationObject as OpenAPIV3.OperationObject
            this.generateGroups(obj.tags)

            const protocol =
              pathItemObj.servers
                ?.find((n) => n.url)
                ?.url?.split(':')
                .at(0) || 'http'

            const apiData: ApiData = {
              ...obj,
              collectionType: CollectionTypeEnum.API_DATA,
              name: obj.summary || obj.operationId || path,
              uri: path,
              protocol: Protocol[protocol.toUpperCase()],
              apiAttrInfo: {
                requestMethod: RequestMethod[method.toUpperCase()],
                contentType: this.getBodyType(
                  obj.requestBody as OpenAPIV3.RequestBodyObject
                )
              },
              requestParams: {
                headerParams: this.generateEditParams('header', obj.parameters),
                queryParams: this.generateEditParams('query', obj.parameters),
                restParams: this.generateEditParams('path', obj.parameters),
                bodyParams: this.generateBody(obj.requestBody)
              },
              responseList: [
                {
                  isDefault: 1,
                  contentType: contentTypeMap.get(
                      this.getResponseContentType(obj.responses)
                    ),
                  responseParams: {
                    headerParams: this.generateResponseHeaders(
                        this.getResponseObject(obj.responses)?.headers
                      ),
                    bodyParams: this.generateResponseBody(obj.responses)
                  }
                }
              ] 
            }

            if (obj.tags?.length) {
              obj.tags.forEach((groupName) =>
                this.groups[groupName].children?.push(apiData)
              )
            } else {
              prev.push(apiData)
            }
          } else if (method === 'servers') {
            this.generateEnvironments(pathItemObj.servers)
          }
        })
      }

      return prev
    }, this.apiDatas)
  }

  generateEditParams(
    _in: 'header' | 'query' | 'path',
    parameters?: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[]
  ) {
    if (!parameters) return []
    return parameters.reduce<HeaderParam[]>((prev, curr, index) => {
      if (this.is$ref(curr)) {
      } else if (_in === curr.in) {
        prev.push(this.genParams( curr, { 
          partType: mui[_in],
          orderNo: index
        }))
      }

      return prev
    }, [])
  }

  getBodyJsonType(
    body?:
      | OpenAPIV3.ReferenceObject
      | OpenAPIV3.RequestBodyObject
      | OpenAPIV3.ResponseObject
  ) {
    let type = 'object'
    if (this.is$ref(body)) {
      const [ref] = this.get$Ref(body)
      const schema = this.getSchemaBy$ref(ref)
      if (schema?.type) {
        type = schema.type
      }
    } else if (body?.content) {
      const media = Object.values(body.content).at(0)
      if (media && this.is$ref(media.schema)) {
        type = this.getBodyJsonType(media.schema)
      } else if (!this.is$ref(media?.schema) && media?.schema?.type) {
        type = media?.schema?.type
      }
    }
    return type === 'array' ? ContentType.JSON_ARRAY : ContentType.JSON_OBJECT
  }

  getBodyType(body?: OpenAPIV3.RequestBodyObject) {
    if (!body?.content) {
      return ContentType.JSON_OBJECT
    }
    const contentType = Object.keys(body.content).at(0) as any
    return contentType && contentTypeMap.has(contentType)
      ? contentTypeMap.get(contentType)!
      : ContentType.JSON_OBJECT
  }

  is$ref(schema: any = {}): schema is OpenAPIV3.ReferenceObject {
    const [ref] = this.get$Ref(schema)
    return Boolean(ref)
  }

  get$Ref = (schema: any = {}): [string, OpenAPIV3.BaseSchemaObject] => {
    const { items, allOf, anyOf, oneOf } = schema
    const of = [allOf, anyOf, oneOf].find((n) => n) || []
    const target = [items, schema].concat(of).find((n) => n?.$ref)
    const s = of?.reduce?.((p, c) => ({ ...p, ...c }), {})
    return [target?.$ref, s]
  }

  transformProperties(
    properties: OpenAPIV3.BaseSchemaObject['properties'] = {},
    required: string[] = [],
    lastRef = ''
  ): BodyParam[] {
    return Object.entries(properties).map(([name, value]) => {
      const [ref] = this.get$Ref(value)
      const schemaObject = ref
        ? this.getSchemaBy$ref(ref)
        : (value as OpenAPIV3.SchemaObject)

      if (!schemaObject) {
        return {}
      }

      const { type, description, default: defaultValue, example } = schemaObject
      // const ref = this.get$Ref(schemaObject)

      const editBody: BodyParam = {
        // ...other, 
        name,
        isRequired: Number(required.includes(name)),
        partType: mui.body,
        dataType: ~~ApiParamsType[
            value.type || formatType(type!) || getDataType(defaultValue ?? '')
          ],
        description: description || '',
        paramAttr: {
          example: safeStringify(defaultValue || example || '')
        }
      }

      if (ref === lastRef || this.propertiesMap.get(ref)) {
        return {
          ...this.propertiesMap.get(ref),
          ...editBody
        }
      }

      if (ref) {
        this.propertiesMap.set(ref, editBody)
        const schema = this.getSchemaBy$ref(ref)
        Object.assign(editBody, {
          // type: type,
          childList: schema?.properties
            ? this.transformProperties(schema?.properties, schema.required, ref)
            : undefined
        })
      } else if (
        type === 'array' &&
        (schemaObject?.items as OpenAPIV3.SchemaObject)?.properties
      ) {
        const items = schemaObject?.items as OpenAPIV3.SchemaObject
        Object.assign(editBody, {
          childList: this.transformProperties(
            items?.properties,
            items.required,
            ref
          )
        })
      } else if (type === 'object' && schemaObject?.properties) {
        Object.assign(editBody, {
          childList: this.transformProperties(
            schemaObject?.properties,
            schemaObject.required,
            ref
          )
        })
      }
      return editBody
    })
  }

  schema2PostcatiEditBody(
    schema?: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
  ): BodyParam[] {
    if (!schema) return []

    if (this.is$ref(schema)) {
      const [ref, innerSchema] = this.get$Ref(schema)
      const schemaObject = this.getSchemaBy$ref(ref)

      return schemaObject
        ? this.schema2PostcatiEditBody(schemaObject).concat(
            this.transformProperties(
              innerSchema?.properties,
              innerSchema?.required
            )
          )
        : []
    } else if (schema.type === 'array') {
      const items = schema.items as OpenAPIV3.SchemaObject
      return this.transformProperties(items?.properties, schema.required)
    } else if (schema.type === 'object') {
      return this.transformProperties(schema?.properties, schema.required)
    } else {
      return schema.example
    }
  }

  getSchemaBy$ref($ref = '') {
    const entity = $ref?.split('/').at(-1)
    return entity ? this.structMap.get(entity) : undefined
  }

  generateBody(
    body?:
      | OpenAPIV3.ReferenceObject
      | OpenAPIV3.RequestBodyObject
      | OpenAPIV3.ResponseObject
  ): [] | BodyParam[] {
    if (!body) {
      return []
    }
    if (this.is$ref(body)) {
      const [ref] = this.get$Ref(body)
      const schemaObject = this.getSchemaBy$ref(ref)
      return schemaObject ? this.schema2PostcatiEditBody(schemaObject) : []
    } else if (body?.content) {
      const media = Object.values(body.content).at(0)
      return media?.schema ? this.schema2PostcatiEditBody(media?.schema) : []
    }
    return this.schema2PostcatiEditBody(body)
  }

  generateResponseBody(responses: OpenAPIV3.ResponsesObject) {
    const resObj = this.getResponseObject(responses)
    if (resObj?.content) {
      return this.schema2PostcatiEditBody(
        Object.values(resObj.content).at(0)?.schema
      )
    } else {
      return []
    }
  }

  getResponseContentType(responses: OpenAPIV3.ResponsesObject): ContentTypeMapKey {
    const resObj = this.getResponseObject(responses)
    if (resObj?.content) {
      return Object.keys(resObj?.content).at(0) as ContentTypeMapKey || 'application/json'
    } else {
      return 'application/json'
    }
  }

  getResponseObject(
    responses: OpenAPIV3.ResponsesObject
  ): OpenAPIV3.ResponseObject | undefined {
    const successCode = [200, 201].find((code) => responses[code])
    if (successCode) {
      return responses[successCode] as OpenAPIV3.ResponseObject
    } else {
      return Object.values(responses).at(0) as OpenAPIV3.ResponseObject
    }
  }

  generateResponseHeaders(headers: OpenAPIV3.ResponseObject['headers'] = {}) {
    return Object.entries(headers).reduce<BodyParam[]>(
      (prev, [name, detail], index) => {
        if (!this.is$ref(detail)) {
          prev.push(
            this.genParams( detail, {
              name,
              partType: mui.header,
              orderNo: index
            })
          )
        }
        return prev
      },
      []
    )
  }

  genParams(
    obj: OpenAPIV3.ParameterBaseObject,
    opts?: BodyParam
  ): BodyParam {
    return {
      ...obj,
      dataType: ~~ApiParamsType[obj?.type],
      isRequired: Number(obj.required),
      description: obj.description || '',
      paramAttr: {
        example: safeStringify(obj.example ?? '')
      },
      ...opts
    }
  }
}
