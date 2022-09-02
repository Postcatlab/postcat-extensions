import {
  isString,
  isObject,
  uniqueSlash,
  getDataType
} from '../../../../../shared/src/utils/is'

import {
  Collections,
  Environment,
  Child,
  ApiData,
  ApiEditHeaders,
  ApiEditBody,
  ApiBodyEnum,
  JsonRootType
} from '../../../../../shared/src/types/eoapi'
import { text2UiData } from '../../../../../shared/src/utils/data-transfer'
import { whatTextType } from '../../../../../shared/src/utils/common'

const METHOD_ARR = [
  'POST',
  'GET',
  'PUT',
  'DELETE',
  'HEAD',
  'OPTIONS',
  'PATCH'
] as const

const tmpParamTypeArr = [
  'string',
  'file',
  'json',
  'int',
  'float',
  'double',
  'date',
  'datetime',
  'boolean',
  'byte',
  'short',
  'long',
  'array',
  'object',
  'number',
  'null'
] as const

const apiBodyTypes = ['formData', 'raw', 'json', 'xml', 'binary'] as const
export class EolinkImporter {
  eoapiData: Collections
  eolinkData

  constructor(data) {
    this.eolinkData = data
    this.eoapiData = this.transformToEoapi(data)
  }

  transformToEoapi(data): Collections {
    return {
      collections: this.transformItems([
        {
          name: data.info?.name || 'postman collection name',
          item: data.item
        }
      ]),
      enviroments: this.transformEnv(data.variable)
    }
  }

  transformItems(items: any[]): Child[] {
    return items.map((item) => {
      const group =
        Array.isArray(item.childGroupList) && item.childGroupList.length
          ? this.transformItems(item.childGroupList)
          : []

      const apis = item?.apiList?.map((apiItem) => {
        const { baseInfo, apiType } = apiItem

        return {
          name: baseInfo?.apiName,
          uri: baseInfo?.apiURI,
          protocol: apiType,
          method: METHOD_ARR[baseInfo?.apiRequestType || 0],
          requestBodyType: apiBodyTypes[baseInfo.apiRequestParamType],
          requestBodyJsonType: ['array', 'json'][
            baseInfo?.apiRequestParamJsonType
          ],
          requestBody: this.handleRequestBody(apiItem),
          queryParams: this.handleQueryParams(request?.url),
          restParams: [],
          requestHeaders: this.handleRequestHeader(request?.header),
          responseHeaders: this.handleResponseHeaders(apiItem.responseHeader),
          responseBodyType: this.handleResponseBodyType(response),
          responseBodyJsonType: 'object',
          responseBody: this.handleResponseBody(response)
        }
      })

      return {
        name: item.name,
        children: [...group, ...apis]
      }
    })
  }

  transformEnv(postmanEnv: any[] = []): Environment[] {
    return [
      {
        name: 'postImport',
        hostUri: 'http://localhost',
        parameters: postmanEnv.map((item) => ({
          name: item.key!,
          value: item.value as unknown as string
        }))
      }
    ]
  }

  handleUrl(url = ''): string {
    if (isString(url)) {
      return url
    } else {
      const newUri = this.postmanData.variable?.reduce((prev, curr) => {
        return prev?.replace(`{{${curr.key}}}`, String(curr.value || ''))
      }, url?.raw)
      return uniqueSlash(newUri || url?.raw || '')
    }
  }

  handleQueryParams(url = ''): ApiData['queryParams'] {
    if (isString(url)) {
      return []
    } else {
      return (
        url.query?.map((n) => ({
          name: n.key || '',
          example: n.value || '',
          required: false,
          description: n.description as string
        })) || []
      )
    }
  }

  handleRequestHeader(headerList): ApiEditHeaders[] {
    if (isString(headerList)) {
      return []
    } else {
      return (
        headerList.map((n) => ({
          name: n.key,
          example: n.value,
          required: true,
          description: n.description as string
        })) || []
      )
    }
  }

  handleRequestBodyType(body): ApiBodyEnum {
    switch (body?.mode) {
      case ApiBodyEnum.Raw:
        const type = whatTextType(body.raw)
        return ['xml', 'json'].includes(type) ? type : ApiBodyEnum.Raw
      case 'file':
        return ApiBodyEnum.Binary
      case 'formdata':
        return ApiBodyEnum['Form-data']
      case 'urlencoded':
        return ApiBodyEnum['Form-data']
      default:
        return ApiBodyEnum.JSON
    }
  }

  handleResponseBodyType(res: Response[] = []): ApiBodyEnum {
    return this.handleRequestBodyType(res[0]?.body)
  }

  handleStructure() {}

  handleRequestBody(apiItem): ApiEditBody[] | string {
    const d = apiBodyTypes
    const { baseInfo, requestInfo } = apiItem
    const apiRequestParamType = baseInfo.apiRequestParamType
    //  raw
    if (apiRequestParamType === 1) {
      return baseInfo?.apiRequestRaw
    } else if ([0, 2, 3].includes(apiRequestParamType)) {
      return requestInfo.map((item) => {
        const structs = this.eolinkData.dataStructureList.filter((n) =>
          apiStructureID.includes(n.structureID)
        )
        return structs.map((n) => ({
          type: tmpParamTypeArr[apiItem.apiRequestParamType],
          name: n.key,
          required: true,
          example: n.value as string,
          description: n.description as string
        }))
      })
    }
  }

  handleResponseBody(res: Response[] = []): ApiEditBody[] | string {
    try {
      const result = JSON.parse(res[0].body.replace(/\s/g, ''))
      return [].concat(result).flatMap((item) => {
        return Object.entries(item).map(([key, value]) => ({
          description: '',
          example: String(value),
          name: key,
          required: true,
          type: getDataType(value),
          children:
            value && typeof value === 'object'
              ? this.transformBodyData(value)
              : undefined
        }))
      })
    } catch (error) {
      return res[0]?.body ?? []
    }
  }

  transformBodyData(val: Record<string, any>[]): ApiEditBody[] {
    return Array()
      .concat(val)
      .flatMap((n) => {
        return Object.entries<any>(n).map(([key, value]) => {
          return {
            description: '',
            example: String(value),
            name: key,
            required: true,
            type: getDataType(value),
            children:
              value && typeof value === 'object'
                ? this.transformBodyData(value)
                : undefined
          }
        })
      })
  }

  handleResponseHeaders(responseHeader = []): ApiEditHeaders[] {
    return responseHeader.map((n) => ({
      name: n.headerName,
      required: n.paramNotNull === '0',
      example: n.default,
      description: n.paramName as string
    }))
  }

  handleJsonRootType(body): JsonRootType {
    let _body = body?.raw

    if (isString(_body)) {
      try {
        _body = JSON.parse(_body.replace(/\s/g, ''))
      } catch (error) {}
    }

    if (Array.isArray(_body)) {
      return JsonRootType.Array
    } else {
      return JsonRootType.Object
    }
  }
}
