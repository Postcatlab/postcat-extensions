import { OpenAPIV3 } from 'openapi-types'
import {
  ApiData,
  ApiEditBody,
  ApiGroup,
  Collections,
  Environment,
  EnvParameters
} from 'shared/src/types/eoAPI'

export const parametersInMap = new Map([
  ['query', 'queryParams'],
  ['path', 'restParams'],
  ['header', 'requestHeaders']
])

class OpenAPIParser {
  data: Collections
  openAPI: OpenAPIV3.Document
  groups: { [name: string]: ApiGroup } = {}
  apiDatas: ApiData[] = []
  enviroments: Environment[] = []

  constructor(openAPI: OpenAPIV3.Document) {
    this.openAPI = openAPI
    const { info, tags, servers, paths } = openAPI
    this.generateGroups(tags)
    this.generateApiDatas(paths)
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
      if (pathItemObj?.servers) {
        this.generateEnviroments(pathItemObj.servers)
      } else if (pathItemObj) {
        Object.entries(pathItemObj).forEach(
          ([method, operationObject]) => {
            if (method in OpenAPIV3.HttpMethods) {
              const obj = operationObject as OpenAPIV3.OperationObject
              this.generateGroups(obj.tags)
              const protocol = pathItemObj.servers?.find(n => n.url)?.url?.split(':').at(0) || 'http'
              prev.push({
                ...obj,
                name: obj.summary || obj.operationId || path,
                uri: path,
                method,
                protocol,
                requestBody:
              })
            }
          }
        )
      }

      return prev
    }, this.apiDatas)
  }

  generateRequestBody(params: OpenAPIV3.ReferenceObject |  OpenAPIV3.RequestBodyObject): ApiEditBody[] {
    if (typeof params === 'string') {

    } else {

    }
  }
}
