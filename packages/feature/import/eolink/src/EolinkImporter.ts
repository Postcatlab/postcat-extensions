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

export class EolinkImporter {
  eoapiData: Collections
  postmanData

  constructor(data) {
    this.postmanData = data
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

      const apis = item?.apiList?.map((n) => {
        const { baseInfo, apiType } = n

        return {
          name: baseInfo?.apiName,
          uri: baseInfo?.apiURI,
          protocol: apiType,
          method: METHOD_ARR[baseInfo?.apiRequestType || 0],
          requestBodyType: this.handleRequestBodyType(request?.body),
          requestBodyJsonType: this.handleJsonRootType(request?.body),
          requestBody: this.handleRequestBody(request?.body),
          queryParams: this.handleQueryParams(request?.url),
          restParams: [],
          requestHeaders: this.handleRequestHeader(request?.header),
          responseHeaders: this.handleResponseHeaders(response),
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

  handleRequestBody(body): ApiEditBody[] | string {
    if (Object.is(body, null)) {
      return []
    } else if (body?.mode === 'raw') {
      try {
        if (whatTextType(body.raw) === 'json') {
          return this.transformBodyData(JSON.parse(body.raw.replace(/\s/g, '')))
        }
        return text2UiData(body.raw || '').data
      } catch (error) {
        console.error(error)
        return body.raw || ''
      }
    } else if (['formdata', 'urlencoded'].includes(body?.mode!)) {
      const data = body?.[body.mode!]
      return (
        data?.map((n) => ({
          type: n.type === 'file' ? 'file' : 'string',
          name: n.key,
          required: true,
          example: n.value as string,
          description: n.description as string
        })) || []
      )
    }
    return []
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

  handleResponseHeaders(res: Response[] = []): ApiEditHeaders[] {
    if (Array.isArray(res[0]?.header)) {
      return res[0].header
        .filter((n) => !isString(n))
        .map((n) => ({
          name: n.key,
          required: Boolean(n.disabled),
          example: n.value,
          description: n.description as string
        }))
    } else {
      return []
    }
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
