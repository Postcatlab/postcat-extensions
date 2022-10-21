import type { OpenAPIV3 } from 'openapi-types'
import {
  ApiBodyEnum,
  ApiData,
  ApiEditBody,
  ApiGroup,
  BasiApiEditParams,
  Collections,
  Environment,
  EnvParameters,
  JsonRootType,
  RequestMethod
} from '../../../../../shared/src/types/eoAPI'
import { getDataType } from '../../../../../shared/src/utils/is'

export const contentTypeMap = new Map<string, ApiBodyEnum>([
  ['application/json', ApiBodyEnum.JSON],
  ['application/xml', ApiBodyEnum.XML],
  ['application/x-www-form-urlencode', ApiBodyEnum['Form-data']],
  ['multipart/form-data', ApiBodyEnum['Form-data']],
  ['text/plain', ApiBodyEnum.Raw]
])

export const parametersInMap = new Map([
  ['query', 'queryParams'],
  ['path', 'restParams'],
  ['header', 'requestHeaders']
])

const typeMap = {
  integer: 'int'
}

const formatType = (type: string) => {
  return typeMap[type] || type
}

export class OpenAPIParser {
  data: Collections
  openAPI: OpenAPIV3.Document
  groups: { [name: string]: ApiGroup } = {}
  apiDatas: ApiData[] = []
  enviroments: Environment[] = []
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
    this.generateEnviroments(servers)

    this.data = {
      collections: [
        {
          name: info.title,
          children: [...Object.values(this.groups), ...this.apiDatas]
        }
      ],
      enviroments: this.enviroments
    }
  }

  generateCompSchemas(components?: OpenAPIV3.ComponentsObject) {
    if (components?.schemas) {
      Object.entries(components.schemas).forEach(([key, value]) => {
        this.structMap.set(key, value as OpenAPIV3.SchemaObject)
      })
    }
  }

  generateEnviroments = (servers: OpenAPIV3.ServerObject[] = []) => {
    if (servers && Array.isArray(servers) && servers.length) {
      servers.forEach((n) => {
        const targetEnv = this.enviroments.find((m) => m.hostUri === n.url) || {
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
    tags: OpenAPIV3.TagObject[] | OpenAPIV3.OperationObject['tags']
  ) {
    return tags?.reduce<typeof this.groups>((prev, curr) => {
      if (typeof curr === 'string') {
        prev[curr] ??= { name: curr, children: [] }
      } else {
        prev[curr.name] ??= { name: curr.name, children: [] }
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
              name: obj.summary || obj.operationId || path,
              uri: path,
              method: method.toUpperCase(),
              protocol,
              requestHeaders: this.generateEditParams('header', obj.parameters),
              restParams: this.generateEditParams('path', obj.parameters),
              queryParams: this.generateEditParams('query', obj.parameters),
              requestBody: this.generateBody(obj.requestBody),
              requestBodyJsonType: this.getBodyJsonType(obj.requestBody),
              requestBodyType: this.getBodyType(
                obj.requestBody as OpenAPIV3.RequestBodyObject
              ),
              responseBody: this.generateResponseBody(obj.responses),
              responseBodyJsonType: this.getBodyJsonType(
                this.getResponseObject(obj.responses)
              ),
              responseBodyType: contentTypeMap.get(
                this.getResponseContentType(obj.responses)
              )
            }

            if (obj.tags?.length) {
              obj.tags.forEach((groupName) =>
                this.groups[groupName].children?.push(apiData)
              )
            } else {
              prev.push(apiData)
            }
          } else if (method === 'servers') {
            this.generateEnviroments(pathItemObj.servers)
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
    return parameters.reduce<BasiApiEditParams[]>((prev, curr) => {
      if (this.is$ref(curr)) {
      } else if (_in === curr.in) {
        prev.push({
          ...curr,
          name: curr.name,
          required: Boolean(curr.required),
          example: String(curr.example ?? ''),
          description: curr.description || ''
        })
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
      const schema = this.getSchemaBy$ref(this.get$Ref(body))
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
    return type === 'array' ? JsonRootType.Array : JsonRootType.Object
  }

  getBodyType(body?: OpenAPIV3.RequestBodyObject) {
    if (!body?.content) {
      return ApiBodyEnum.JSON
    }
    const contentType = Object.keys(body.content).at(0)
    return contentType ? contentTypeMap.get(contentType) : ApiBodyEnum.JSON
  }

  is$ref(schema: any = {}): schema is OpenAPIV3.ReferenceObject {
    const { items, allOf, anyOf, oneOf } = schema
    const of = [allOf, anyOf, oneOf].find((n) => n)?.[0]
    return [items, of, schema].find((n) => n?.$ref)?.$ref
  }

  get$Ref = (schema: any = {}): string | undefined => {
    const { items, allOf, anyOf, oneOf } = schema
    const of = [allOf, anyOf, oneOf].find((n) => n)?.[0]
    return (items || of || schema)?.$ref
  }

  transformProperties(
    properties: OpenAPIV3.BaseSchemaObject['properties'] = {},
    required: string[] = []
  ) {
    return Object.entries(properties).map(([key, value]) => {
      const schemaObject = this.is$ref(value)
        ? this.getSchemaBy$ref(this.get$Ref(value)!)
        : value

      if (!schemaObject) {
        return {}
      }

      const { type, description, default: defaultValue } = schemaObject
      const ref = this.get$Ref(schemaObject)

      // if (this.propertiesMap.get(ref)) {
      //   return this.propertiesMap.get(ref)
      // }
      const editBody = {
        // ...other,
        name: key,
        required: required.includes(key),
        example: String(defaultValue || ''),
        type:
          value.type || formatType(type!) || getDataType(defaultValue ?? ''),
        description: description || '',
        children: schemaObject?.properties
          ? this.transformProperties(
              schemaObject?.properties,
              schemaObject.required
            )
          : undefined
      }
      if (ref) {
        this.propertiesMap.set(ref, editBody)
        const schema = this.getSchemaBy$ref(ref)
        Object.assign(editBody, {
          type: type,
          children: schema?.properties
            ? this.transformProperties(schema?.properties, schema.required)
            : undefined
        })
      } else if (
        type === 'array' &&
        (schemaObject?.items as OpenAPIV3.SchemaObject)?.properties
      ) {
        const items = schemaObject?.items as OpenAPIV3.SchemaObject
        Object.assign(editBody, {
          children: items?.properties
            ? this.transformProperties(items?.properties, items.required)
            : undefined
        })
      }
      return editBody
    })
  }

  schema2eoapiEditBody(
    schema?: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
  ): ApiEditBody[] | string {
    if (!schema) return []

    if (this.is$ref(schema)) {
      const schemaObject = this.getSchemaBy$ref(this.get$Ref(schema)!)
      return schemaObject ? this.schema2eoapiEditBody(schemaObject) : []
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
    const entity = $ref.split('/').at(-1)
    return entity ? this.structMap.get(entity) : undefined
  }

  generateBody(
    body?:
      | OpenAPIV3.ReferenceObject
      | OpenAPIV3.RequestBodyObject
      | OpenAPIV3.ResponseObject
  ): ApiEditBody[] | string {
    if (!body) {
      return []
    }
    if (this.is$ref(body)) {
      const schemaObject = this.getSchemaBy$ref(this.get$Ref(body))
      return schemaObject ? this.schema2eoapiEditBody(schemaObject) : []
    } else if (body?.content) {
      const media = Object.values(body.content).at(0)
      return media?.schema ? this.schema2eoapiEditBody(media?.schema) : []
    }
    return this.schema2eoapiEditBody(body)
  }

  generateResponseBody(responses: OpenAPIV3.ResponsesObject) {
    const resObj = this.getResponseObject(responses)
    if (resObj?.content) {
      console.log(Object.values(resObj.content).at(0))
      return this.schema2eoapiEditBody(
        Object.values(resObj.content).at(0)?.schema
      )
    } else {
      return []
    }
  }

  getResponseContentType(responses: OpenAPIV3.ResponsesObject) {
    const resObj = this.getResponseObject(responses)
    if (resObj?.content) {
      return Object.keys(resObj?.content).at(0) || 'application/json'
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
}
