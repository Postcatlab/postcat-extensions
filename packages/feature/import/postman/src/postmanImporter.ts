// @ts-nocheck

import { isString, isObject, uniqueSlash, getDataType } from './utils'

import {
  Collections,
  Environment,
  Child,
  ApiData,
  ApiEditHeaders,
  ApiEditBody,
  ApiBodyEnum,
  JsonRootType
} from './types/eoapi'
import type {
  Items,
  HeaderList,
  Request1,
  Url,
  Response,
  Header,
  HttpsSchemaGetpostmanComJsonDraft07CollectionV210,
  VariableList
} from './types/postman-collection'
import { text2UiData } from '../../../../../shared/src/utils/data-transfer'
import {
  whatTextType,
  safeStringify
} from '../../../../../shared/src/utils/common'

export class PostmanImporter {
  eoapiData: Collections
  postmanData: HttpsSchemaGetpostmanComJsonDraft07CollectionV210

  constructor(data: HttpsSchemaGetpostmanComJsonDraft07CollectionV210) {
    this.postmanData = data
    this.eoapiData = this.transformToEoapi(data)
  }

  transformToEoapi(
    data: HttpsSchemaGetpostmanComJsonDraft07CollectionV210
  ): Collections {
    return {
      collections: this.transformItems([
        {
          name: data.info?.name || 'postman collection name',
          item: data.item
        }
      ]),
      environments: this.transformEnv(data.variable)
    }
  }

  transformItems(items: Items[]): Child[] {
    return items.map((item) => {
      if (!item.request) {
        return {
          name: item.name,
          children:
            Array.isArray(item.item) && item.item.length
              ? this.transformItems(item.item)
              : []
        }
      }
      const request = item.request as Request1
      const response = item.response as Response[]

      return {
        name: item.name,
        uri: this.handleUrl(request?.url),
        protocol: 'http',
        method: request?.method,
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
  }

  transformEnv(postmanEnv: VariableList = []): Environment[] {
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

  handleUrl(url: Url = ''): string {
    if (isString(url)) {
      return url
    } else {
      const newUri = this.postmanData.variable?.reduce((prev, curr) => {
        return prev?.replace(`{{${curr.key}}}`, safeStringify(curr.value || ''))
      }, url?.raw)
      return uniqueSlash(newUri || url?.raw || '')
    }
  }

  handleQueryParams(url: Url = ''): ApiData['queryParams'] {
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

  handleRequestHeader(headerList: HeaderList | string = []): ApiEditHeaders[] {
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

  handleRequestBodyType(body: Request1['body']): ApiBodyEnum {
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
    return this.handleRequestBodyType(res[0]?.body as Request1['body'])
  }

  handleRequestBody(body: Request1['body']): ApiEditBody[] | string {
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
      const data = body?.[body.mode!] as NonNullable<
        Request1['body']
      >['formdata']
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
          example: safeStringify(value),
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
        if (typeof n !== 'object') {
          return []
        }
        return Object.entries<any>(n).map(([key, value]) => {
          return {
            description: '',
            example: safeStringify(value),
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
        .filter((n): n is Header => !isString(n))
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

  handleJsonRootType(body: Request1['body']): JsonRootType {
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
