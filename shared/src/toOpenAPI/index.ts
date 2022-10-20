import {
  setBase,
  setPaths,
  setTags,
  setRequestBody,
  setRequestHeader,
  setResponseBody,
  paramTypeHash
} from './utils'
import { ApiData, ApiEditBody, eoAPIType } from '../types/eoAPI'
import { OpenAPIV3 } from 'openapi-types'
import { isString } from '../utils/is'

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

const typeMap = new Map<string, SchemaObjectType>([
  ['json', 'object'],
  ['raw', 'string']
])
class ToOpenApi {
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

    return apiData.reduce((paths, item) => {
      const { uri, name, method, groupID } = item
      const groupName = group.find((n) => n.uuid === groupID)?.name
      paths[uri] = {
        [method.toLocaleLowerCase()]: {
          tags: groupName ? [groupName] : [],
          summary: name,
          description: name,
          operationId: name,
          requestBody: this.generateRequestBody(item),
          responses: {},
          security: []
        }
      }

      return paths
    }, {})
  }
  generateRequestBody(
    apiData: ApiData
  ): OpenAPIV3.RequestBodyObject | undefined {
    const { method, requestBodyJsonType, requestBodyType, requestBody } =
      apiData
    const paramType = paramTypeHash.get(requestBodyJsonType)

    if (!paramType) {
      console.log('paramType', paramType, requestBodyJsonType)
      console.error(`Can't parser the params type`)
      return
    }

    if (['DELETE', 'GET'].includes(method)) {
      return
    }

    return {
      content: {
        [paramType]: {
          schema: this.parseToSchema(
            apiData.requestBody,
            requestBodyJsonType as SchemaObjectType
          )
        }
      },
      required: requestBodyType === 'json' && requestBody?.length > 0
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
    type: SchemaObjectType
  ): OpenAPIV3.SchemaObject {
    if (isString(data)) {
      return {
        type: typeMap.get(type) || type,
        required: [],
        example: data
      } as OpenAPIV3.SchemaObject
    } else {
      return {
        type: typeMap.get(type) || type,
        required: [
          ...new Set(
            data?.filter((it) => it.required).map((it) => it.name) || []
          )
        ],
        properties: data.reduce(
          (
            total,
            { type, required, enum: struct, name, children, ...item }
          ) => ({
            ...total,
            [name]: {
              ...item,
              items: children?.length
                ? this.parseToSchema(children, type as SchemaObjectType)
                : {}
            }
          }),
          {}
        )
      } as OpenAPIV3.SchemaObject
    }
  }
  generateTags(): OpenAPIV3.TagObject[] {
    return this.eoapiData.group.map(({ name }) => ({
      name,
      description: name
    }))
  }
  setRequestBody() {
    this.data = setRequestBody(this.data, this.sourceData)
    return this
  }
  setRequestHeader() {
    this.data = setRequestHeader(this.data, this.sourceData)
    return this
  }
  //   setResponseHeader() {
  //     this.data = setResponseHeader(this.data, this.sourceData)
  //     return this
  //   }
  setResponseBody() {
    this.data = setResponseBody(this.data, this.sourceData)
    return this
  }

  setTags() {
    this.data = setTags(this.data, this.sourceData)
    return this
  }

  // setTagToApi() {
  //   this.data = setTagToApi(this.data, this.sourceData);
  // }
  log(indent = 2) {
    console.log(JSON.stringify(this.data, null, indent))
    return this
  }
  json() {
    return this.data
  }
  yaml() {
    return ''
  }
}

export default ToOpenApi
