import {
  setBase,
  setPaths,
  setTags,
  setRequestBody,
  setRequestHeader,
  setResponseBody,
  paramTypeHash
} from './utils'
import { ApiData, eoAPIType } from '../types/eoAPI'
import { OpenAPIV3 } from 'openapi-types'

// const parseParamsInUrl = (url): string[] => {
//   return url.match(/(?<={)(\S)+?(?=})/g) || []
// }

// const setResponseHeader = (data, { apiData, uri, method }: sourceInterface) => {
//   _.set(data, [uri, method.toLowerCase()], responses)
//   return ''
// }

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
  generateRequestBody(apiData: ApiData): OpenAPIV3.RequestBodyObject | undefined {
    const { method, requestBodyType, requestBody } = apiData
    const paramType = paramTypeHash.get(requestBodyType)

    if (!paramType) {
      console.log('paramType', paramType, requestBodyType)
      console.error(`Can't parser the params type`)
      return
    }

    if (['DELETE', 'GET'].includes(method)) {
      return
    }

      return {
        content: {
          [paramType]: {
            schema: this.
          }
        },
        required: requestBodyType === 'json' && requestBody?.length > 0
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
