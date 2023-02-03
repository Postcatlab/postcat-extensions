import { ContentType, mui, Protocol, RequestMethod } from '../../../shared/src/types/api.model'
import { ApiData, BodyParam, HeaderParam } from '../../../shared/src/types/apiData'
import { Collection, CollectionTypeEnum, ImportProjectDto } from '../../../shared/src/types/pcAPI'
import { isObject } from '../../../shared/src/utils/is'

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

const protocolSupports = [Protocol.HTTP, Protocol.HTTPS, Protocol.SOAP] as const

const apiBodyTypes = ['formData', 'raw', 'json', 'xml', 'binary'] as const

const responseType = ['json', 'xml', 'raw', 'binary'] as const
export class EolinkImporter {
  postcatData: ImportProjectDto
  eolinkData

  constructor(data) {
    this.eolinkData = data
    console.log('this.eolinkData', this.eolinkData)
    this.postcatData = this.transformToPostcat(
      [].concat(data?.apiGroupList || data)
    )
  }

  transformToPostcat(data): ImportProjectDto {
    const projectName = this.eolinkData?.projectInfo?.projectName
    const collections = projectName
      ? [
          { 
            name: projectName,
            collectionType: CollectionTypeEnum.GROUP,
            children: this.transformItems(data) 
          }
      ]
      : this.transformItems(data)
    return {
      collections,
      environmentList: this.transformEnv(this.eolinkData?.env)
    }
  }

  transformEnv(env: any[] = []) {
    return env.map((item) => {
      let params: any[] = []
      try {
        params = JSON.parse(item?.globalVariable)
      } catch (error) {}
      return {
        name: item.envName || '',
        hostUri: item.frontURI || '',
        parameters: params.map((n) => ({
          name: n.paramKey,
          value: n.paramValue,
          description: ''
        }))
      }
    })
  }

  transformItems(items: any[]): ImportProjectDto['collections'] {
    return items.map((item) => {
      const groupList =
        item.childGroupList || item.apiGroupList || item.apiGroupChildList
      const group =
        Array.isArray(groupList) && groupList.length
          ? this.transformItems(groupList)
          : []
      const apis =
        item.apiList?.map((apiItem) => {
          const {
            baseInfo,
            apiType,
            requestInfo,
            headerInfo,
            urlParam,
            restfulParam
          } = apiItem

          const protocol = apiType.startsWith('http')
          ? apiType
          : protocolSupports.includes(apiType)
          ? 'http'
          : apiType

          return {
            collectionType: CollectionTypeEnum.API_DATA,
            name: baseInfo?.apiName,
            uri: baseInfo?.apiURI,
            protocol: Protocol[protocol.toUpperCase()],
            method: METHOD_ARR[baseInfo?.apiRequestType || 0],
            apiAttrInfo: {
              requestMethod: RequestMethod[METHOD_ARR[baseInfo?.apiRequestType || 0]],
              contentType: baseInfo.apiRequestParamType
            },
            requestParams: {
              headerParams:this.handleResponseHeaders(headerInfo || []),
              queryParams: this.handleInfo(urlParam, 'queryParams'),
              restParams: this.handleInfo(restfulParam || [], 'restParams'),
              bodyParams: this.handleInfo(requestInfo, 'bodyParams')
            },
            responseList: [
              {
                isDefault: 1,
                contentType: this.getResponseContentType(apiItem),
                responseParams: {
                  headerParams: this.handleResponseHeaders(
                    apiItem.responseHeader || []
                  ),
                  bodyParams: this.handleResponseBody(apiItem)
                }
              }
            ] , 
          } as Collection
        }) || []


      return {
        name: item.groupName,
        collectionType: CollectionTypeEnum.GROUP,
        children: [
          ...group,
          ...apis.filter((n) => protocolSupports.includes(n.protocol))
        ]
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

  handleRequestHeader(headerList): HeaderParam[] {
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

  handleStructureData(infoItem, _in?: keyof typeof mui) {
    const { globaldataStructureList = [], dataStructureList = [] } =
      this.eolinkData

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
          partType: mui[_in!],
          dataType: Number(s.paramType),
          name: s.paramKey,
          isRequired: Number(this.isRequired(s.paramNotNull)),
          paramAttr: {
            example: this.getDefaultValue(s),
          },
          description: s.paramName || '',
          childList: this.handleInfo(s.childList,_in)
        } as BodyParam
      })
    }
  }

  handleInfo(info: any[] = [], _in?: keyof typeof mui): BodyParam[] {
    return info
      .flatMap<BodyParam>((item) => {
        // 是否是引用数据结构
        if (item.structureID) {
          return this.handleStructureData(item, _in)
          // 普通数据
        } else {
          return {
            partType: mui[_in!],
            dataType: Number(item.paramType),
            name: item.paramKey,
            isRequired: Number(this.isRequired(item.paramNotNull)),
            paramAttr: {
              example: this.getDefaultValue(item),
            },
            description: item.paramName || '',
            childList: this.handleInfo(item.childList, _in)
          }
        }
      })
      .filter(Boolean)
  }

  handleResponseBody(api) {
    const { apiSuccessMock, apiFailureMock, resultInfo } = api.baseInfo
    if (resultInfo?.[0]?.paramList?.length) {
     return this.handleInfo(resultInfo?.[0]?.paramList)
    } else if (apiSuccessMock || apiFailureMock) {
      return [
        {
          name: '',
          isRequired: 1,
          binaryRawData: apiSuccessMock || apiFailureMock,
          paramAttr: {}
        }
      ]
    } else {
      return []
    }
  }

  getResponseContentType(apiItem){
    if (apiItem.resultInfo?.[0]?.paramList?.length) {
    return ContentType[responseType[apiItem.resultInfo?.[0]?.responseType]] || ContentType.JSON_OBJECT
    } else {
      return ContentType.RAW
    }
  }

  handleResponseHeaders(responseHeader: any[] = []): HeaderParam[] {
    return responseHeader.map((n) => ({
      name: n.headerName || '',
      partType: mui.headerParams,
      isRequired: Number(n.paramNotNull === '0'), 
      description: n.paramName || '',
      paramAttr: {
        example: this.getDefaultValue(n),
      }
    }))
  }
}
