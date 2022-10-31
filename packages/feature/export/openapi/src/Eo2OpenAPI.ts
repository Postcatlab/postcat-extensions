import {
  ApiData,
  ApiEditBody,
  ApiEditHeaders,
  eoAPIType
} from 'shared/src/types/eoAPI'
import { OpenAPIV3 } from 'openapi-types'

// const parseParamsInUrl = (url): string[] => {
//   return url.match(/(?<={)(\S)+?(?=})/g) || []
// }

// const setResponseHeader = (data, { apiData, uri, method }: sourceInterface) => {
//   _.set(data, [uri, method.toLowerCase()], responses)
//   return ''
// }

type SchemaObjectType =
  | OpenAPIV3.ArraySchemaObjectType
  | OpenAPIV3.NonArraySchemaObjectType

const bodyTypeMap = new Map([
  ['json', 'object'],
  ['raw', 'string'],
  ['int', 'integer']
])

export const contentTypeMap = new Map([
  ['json', 'application/json'],
  ['xml', 'application/xml'],
  ['formData', 'application/x-www-form-urlencode'],
  ['binary', 'multipart/form-data'],
  ['raw', 'text/plain']
] as const)

export const parametersInMap = new Map([
  ['queryParams', 'query'],
  ['restParams', 'path'],
  ['requestHeaders', 'header']
] as const)

class EoToOpenApi {
  data: OpenAPIV3.Document
  eoapiData: eoAPIType
  constructor(eoapiData: eoAPIType) {
    this.eoapiData = eoapiData
    const { version, project } = this.eoapiData

    this.data = {
      openapi: '3.0.1',
      info: {
        title: project.name,
        description: project.name || '',
        termsOfService: '',
        contact: {},
        license: {
          name: 'Apache 2.0',
          url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
        },
        version: version || '1.0.0'
      },
      externalDocs: {
        description: 'Find out more about Swagger',
        url: 'http://swagger.io'
      },
      servers: [],
      paths: this.generatePaths(),
      tags: this.generateTags(),
      components: {}
    }
  }
  generatePaths(): OpenAPIV3.PathsObject {
    const { apiData, group } = this.eoapiData

    return apiData.reduce<OpenAPIV3.PathsObject>((paths, item) => {
      const { uri, name, method, groupID } = item
      const groupName = group.find((n) => n.uuid === groupID)?.name
      const httpMethod = method.toLowerCase() as OpenAPIV3.HttpMethods
      paths[uri] ??= {}
      paths[uri]![httpMethod] = {
        tags: groupName ? [groupName] : [],
        summary: name,
        description: name,
        operationId: name,
        parameters: this.generateParameters(item),
        requestBody: this.generateRequestBody(item),
        responses: this.generateResponseBody(item),
        security: []
      }

      return paths
    }, {})
  }
  generateParameters(
    apiData: ApiData
  ): OpenAPIV3.ParameterObject[] | undefined {
    return [...parametersInMap.keys()].reduce<OpenAPIV3.ParameterObject[]>(
      (prev, key) => {
        const item = apiData[key]
        if (item && item.length) {
          item.forEach((n) => {
            n.name &&
              prev.push({
                ...n,
                in: parametersInMap.get(key)!,
                schema: {
                  type: typeof n.example as OpenAPIV3.NonArraySchemaObjectType
                }
              })
          })
        }
        return prev
      },
      []
    )
  }
  generateRequestBody(
    apiData: ApiData
  ): OpenAPIV3.RequestBodyObject | undefined {
    const { method, requestBodyJsonType, requestBodyType, requestBody } =
      apiData
    const contentType = contentTypeMap.get(requestBodyType!)

    if (!contentType) {
      console.log('contentType', contentType, requestBodyType)
      console.error(`Can't parser the content type`)
      return
    }

    if (['DELETE', 'GET'].includes(method)) {
      return
    }

    return {
      content: {
        [contentType]: {
          schema: this.parseToSchema(
            apiData.requestBody,
            requestBodyJsonType as SchemaObjectType
          )
        }
      },
      required: requestBodyType === 'json' && requestBody?.length > 0
    }
  }
  generateResponseBody(apiData: ApiData): OpenAPIV3.ResponsesObject {
    const {
      responseBodyJsonType,
      responseBodyType,
      responseBody,
      responseHeaders
    } = apiData
    const contentType = contentTypeMap.get(responseBodyType!)

    if (!contentType) {
      console.log('contentType', contentType, responseBodyJsonType)
      console.error(`Can't parser the content type`)
      return {}
    }

    return {
      '200': {
        description: 'OK',
        headers: this.generateResponseHeaders(responseHeaders),
        content: {
          [contentType]: {
            schema: this.parseToSchema(
              responseBody!,
              responseBodyJsonType as SchemaObjectType
            )
          }
        }
      }
    }
  }

  /**
   *
   * @param data
   * @param type data type
   * @returns
   */
  parseToSchema(
    data: ApiEditBody[] | string,
    type: SchemaObjectType,
    rest = {}
  ): OpenAPIV3.ArraySchemaObject | OpenAPIV3.NonArraySchemaObject {
    if (typeof data === 'string') {
      return {
        type: 'string',
        example: data
      } as OpenAPIV3.SchemaObject
    } else {
      const schemaType = bodyTypeMap.get(type) || type
      if (schemaType === 'array') {
        return {
          ...rest,
          type: schemaType,
          required: this.getRequired(data),
          items: this.parseToSchema(data, 'object')
        } as OpenAPIV3.ArraySchemaObject
      } else {
        return {
          ...rest,
          type: schemaType as OpenAPIV3.NonArraySchemaObjectType,
          required: this.getRequired(data),
          properties: data?.reduce<
            NonNullable<OpenAPIV3.BaseSchemaObject['properties']>
          >((prev, curr) => {
            const { type, name, children, required, ...item } = curr
            if (children?.length) {
              prev[name] = this.parseToSchema(
                children,
                type as SchemaObjectType,
                item
              )
            } else {
              prev[name] = {
                ...item,
                type: type as any,
                enum: curr.enum?.length
                  ? curr.enum.map((n) => n.value)
                  : undefined,
                items: type === 'array' ? {} : undefined
              }
            }

            return prev
          }, {})
        }
      }
    }
  }

  generateResponseHeaders(headers?: ApiEditHeaders[]) {
    return headers?.reduce((prev, curr) => {
      prev[curr.name] = curr
      return prev
    }, {})
  }

  getRequired(data: ApiEditBody[]) {
    const requireds = [
      ...new Set(data?.filter((it) => it.required).map((it) => it.name) || [])
    ]
    return requireds.length ? requireds : undefined
  }

  generateTags(): OpenAPIV3.TagObject[] {
    return this.eoapiData.group.map(({ name }) => ({
      name,
      description: name
    }))
  }
}

export default EoToOpenApi
