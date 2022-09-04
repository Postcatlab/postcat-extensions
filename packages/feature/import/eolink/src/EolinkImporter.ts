import { isObject } from '../../../../../shared/src/utils/is'

import {
  Collections,
  Child,
  ApiEditHeaders
} from '../../../../../shared/src/types/eoapi'

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

const responseType = ['json', 'xml', 'raw', 'binary'] as const
export class EolinkImporter {
  eoapiData: Collections
  eolinkData

  constructor(data) {
    this.eolinkData = data
    this.eoapiData = this.transformToEoapi([].concat(data))
  }

  transformToEoapi(data): Collections {
    return {
      collections: this.transformItems(data),
      enviroments: []
    }
  }

  transformItems(items: any[]): Child[] {
    console.log('items', items)
    return items.map((item) => {
      const group =
        Array.isArray(item.childGroupList) && item.childGroupList.length
          ? this.transformItems(item.childGroupList)
          : []
      const apis =
        item.apiList?.map((apiItem) => {
          const {
            baseInfo,
            apiType,
            requestInfo,
            resultInfo,
            headerInfo,
            urlParam,
            restfulParam
          } = apiItem

          return {
            name: baseInfo?.apiName,
            uri: baseInfo?.apiURI,
            protocol: apiType,
            method: METHOD_ARR[baseInfo?.apiRequestType || 0],
            requestBodyType: apiBodyTypes[baseInfo.apiRequestParamType],
            requestBodyJsonType: ['array', 'json'][
              baseInfo?.apiRequestParamJsonType
            ],
            requestBody: this.handleInfo(requestInfo),
            queryParams: this.handleInfo(urlParam),
            restParams: this.handleInfo(restfulParam || []),
            requestHeaders: this.handleResponseHeaders(headerInfo || []),
            responseHeaders: this.handleResponseHeaders(
              apiItem.responseHeader || []
            ),
            responseBodyType:
              responseType[resultInfo?.[0]?.responseType] || 'json',
            responseBodyJsonType: ['object', 'array'][
              resultInfo?.[0]?.paramJsonType || 0
            ],
            responseBody: this.handleInfo(resultInfo?.[0]?.paramList || [])
          }
        }) || []

      return {
        name: item.groupName,
        children: [...group, ...apis]
      }
    })
  }

  getDefaultValue(item) {
    return (
      item.paramValueList?.find?.((n) => n?.radio)?.value ||
      (item.paramValue ?? item.default ?? item.headerValue) ||
      ''
    )
  }

  handleRequestHeader(headerList): ApiEditHeaders[] {
    return (
      headerList.map((n) => ({
        name: n.headerName,
        example: n.value,
        required: true,
        description: n.description as string
      })) || []
    )
  }

  isRequired(paramNotNull) {
    return paramNotNull === '0'
  }

  handleStructureData(infoItem) {
    const { globaldataStructureList, dataStructureList } = this.eolinkData

    const structureList = infoItem.structureID.startsWith?.('S')
      ? globaldataStructureList
      : dataStructureList
    const targetStructureID = `${infoItem.structureID}`.replace('S', '')

    const target = structureList.find((n) => n.structureID == targetStructureID)
    if (target?.structureData) {
      return JSON.parse(target.structureData).map((s) => {
        if (isObject(infoItem?.updateData?.[s.paramID])) {
          s = {
            ...s,
            ...infoItem?.updateData?.[s.paramID]
          }
        }
        return {
          type: tmpParamTypeArr[s.paramType],
          name: s.paramKey,
          required: this.isRequired(s.paramNotNull),
          example: this.getDefaultValue(s),
          description: s.paramName || '',
          children: this.handleInfo(s.childList)
        }
      })
    }
  }

  handleInfo(info: any[] = []) {
    return info.flatMap((item) => {
      // 是否是引用数据结构
      if (item.structureID) {
        return this.handleStructureData(item)
        // 普通数据
      } else {
        return {
          type: tmpParamTypeArr[item.paramType],
          name: item.paramKey,
          required: this.isRequired(item.paramNotNull),
          example: this.getDefaultValue(item),
          description: item.paramName || '',
          children: this.handleInfo(item.childList)
        }
      }
    })
  }

  handleResponseHeaders(responseHeader: any[] = []): ApiEditHeaders[] {
    return responseHeader.map((n) => ({
      name: n.headerName || '',
      required: n.paramNotNull === '0',
      example: this.getDefaultValue(n),
      description: n.paramName || ''
    }))
  }
}
