import {ApiParamsType, ContentType, mui, Protocol, RequestMethod, PARAM_TYPE} from '../../../shared/src/types/api.model'
import {ApiData, BodyParam, HeaderParam, RequestParams, ResponseParams} from '../../../shared/src/types/apiData'
import {CollectionTypeEnum, ImportProjectDto} from '../../../shared/src/types/pcAPI'
import {Group} from "../../../shared/src/types/group";
import {getDataType} from "../../postcat-import-postman/src/utils";
import {safeJSONParse, safeStringify, whatTextType} from "../../../shared/src/utils/common";

enum TargetTypeEnum {
  GROUP = "folder",
  API = "api"
}

export class APIPostImporter {
  postcatData: ImportProjectDto
  apipostData

  constructor(data) {
    this.apipostData = data
    // console.log('this.apipostData', this.apipostData)
    this.postcatData = this.transformToPostcat(this.apipostData)
    console.log('postcatData', this.postcatData)
  }

  transformToPostcat(data): ImportProjectDto {
    // 项目名
    const projectName = data.project?.name
    const projectDescription = data.project?.description
    const collections = [{
        name: projectName || 'Import from ApiPost',
        collectionType: CollectionTypeEnum.GROUP,
        children: this.transformItems(data?.apis)
      }]
    const environmentList = this.transformEnv(data?.envs)
    return {
      name: projectName,
      description: projectDescription,
      environmentList: environmentList,
      collections,
    }
  }

  transformEnv(env: any[] = []): ImportProjectDto['environmentList'] {
    return env?.map((item) => {
      return {
        name: item?.name || '',
        hostUri: item?.pre_url || '',
        // todo params list for envs.list?
      }
    }) || []
  }

  transformItems(items: any): ImportProjectDto['collections'] {
    return items?.map((item) => {
      // 处理分组
      if (TargetTypeEnum.GROUP == item.target_type) {
        return {
          // 名字
          name: item.name,
          collectionType: CollectionTypeEnum.GROUP,
          // 递归处理子节点
          children:
            Array.isArray(item.children) && item.children.length
              ? this.transformItems(item.children)
              : []
        } as Group
      } else if (TargetTypeEnum.API == item.target_type) {
        const request: any = item.request;
        const response: any = item.response;

        const apiName = item.name;
        // @ts-ignore
        const apiUri = request?.url || '$' + item.name;
        const apiProtocol = Protocol.HTTP;
        const apiMethod = item.method as string;

        return {
          collectionType: CollectionTypeEnum.API_DATA,
          name: apiName,
          uri: apiUri,
          protocol: apiProtocol,
          apiAttrInfo: {
            requestMethod: RequestMethod[apiMethod?.toUpperCase() || 'GET'],
            contentType: this.handleRequestBodyType(request?.body?.mode)
          },
          requestParams: {
            headerParams: this.handleRequestHeader(request?.header),
            queryParams: this.handleQueryParams(request?.query),
            restParams: this.handleRestParams(request?.resful),
            bodyParams: this.handleRequestBody(request?.body)
          },
          responseList: [
            {
              isDefault: 1,
              contentType: this.handleResponseBodyType(response),
              responseParams: {
                // 没有header?
                headerParams: [],
                bodyParams: this.handleResponseBody(response)
              }
            }
          ]
        } as ApiData
      } else {
        console.error("unknown target_type");
        return {} as Group;
      }
    }) || []
  }


  handleQueryParams(queryList): RequestParams['queryParams'] {
    return (
      queryList?.parameter?.map((n) => ({
        partType: mui.queryParams,
        paramType: PARAM_TYPE.input,
        name: n.key.slice(0, 100) || '',
        dataType: ApiParamsType[typeof n.value],
        isRequired: n.not_null == 1 ? 1 : 0,
        description: n.description.slice(0, 500) as string,
        paramAttr: {
          example: n.value || ''
        }
      })) || []
    )
  }

  handleRestParams(restList): RequestParams['restParams'] {
    return (
      restList?.parameter?.map((n) => ({
        partType: mui.restParams,
        paramType: PARAM_TYPE.input,
        name: n.key.slice(0, 100) || '',
        dataType: ApiParamsType.string,
        isRequired: n.not_null == 1 ? 1 : 0,
        description: n.description.slice(0, 500) as string,
        paramAttr: {
          example: n.value || ''
        }
      })) || []
    )
  }


  handleRequestBodyType(typeStr): ContentType {
    switch (typeStr) {
      case 'raw':
        const type = whatTextType(typeStr.raw)
        if (type === 'xml') {
          return ContentType.XML
        } else if (type === 'json') {
          return Array.isArray(safeJSONParse(typeStr.raw))
            ? ContentType.JSON_ARRAY
            : ContentType.JSON_OBJECT
        } else {
          return ContentType.RAW
        }
      case 'json':
        return Array.isArray(safeJSONParse(typeStr.raw))
          ? ContentType.JSON_ARRAY
          : ContentType.JSON_OBJECT
      case 'xml':
        return ContentType.XML
      case 'file':
        return ContentType.BINARY
      case 'formdata':
        return ContentType.FROM_DATA
      case 'urlencoded':
        return ContentType.FROM_DATA
      default:
        return ContentType.JSON_OBJECT
    }
  }

  handleResponseBodyType(res: any): ContentType {
    return this.handleRequestBodyType(res?.success?.expect?.contentType)
  }

  handleRequestBody(body): RequestParams['bodyParams'] {
    if (Object.is(body, null)) {
      return []
      // json类型
    } else if (body?.mode === 'json') {
      try {
        // 由于raw_para没有父子关系，只能通过raw去递归转化
        if (body.raw == '') {
          return [];
        } else {
          return this.transformBodyData(JSON.parse(body.raw.replace(/\s/g, '')), PARAM_TYPE.input)
        }
      } catch (error) {
        // 转换出错直接存raw
        console.error(error)
        return [
          {
            partType: mui.bodyParams,
            paramType: PARAM_TYPE.input,
            name: '',
            isRequired: 1,
            binaryRawData: body.raw || '',
            paramAttr: {}
          }
        ]
      }
      // raw类型
    } else if (body?.mode === 'raw') {
      return [{
        partType: mui.bodyParams,
        paramType: PARAM_TYPE.input,
        binaryRawData: body.raw || ''
      }]
      // 表单类型
    } else if (['formdata', 'urlencoded'].includes(body?.mode)) {
      return (
        body?.parameter?.map((n) => ({
          partType: mui.bodyParams,
          paramType: PARAM_TYPE.input,
          name: n.key.slice(0, 100) || '',
          dataType: ApiParamsType[typeof n.value],
          isRequired: n.not_null == 1 ? 1 : 0,
          description: n.description.slice(0, 500) as string,
          paramAttr: {
            example: n.value || ''
          }
        })) || []
      )
    }
    return []
  }

  handleResponseBody(res: any): ResponseParams['bodyParams'] {
    try {
      const result = JSON.parse(res.success?.raw?.replace(/\s/g, '')!)
      return  this.transformBodyData(result, PARAM_TYPE.input)
    } catch (error) {
      return res?.success?.raw
        ? [
          {
            partType: mui.bodyParams,
            paramType: PARAM_TYPE.output,
            name: '',
            isRequired: 1,
            binaryRawData: res?.success?.raw,
            paramAttr: {}
          }
        ]
        : []
    }
  }

  transformBodyData(val: Record<string, any>[], paramType): BodyParam[] {
    return Array()
      .concat(val)
      .flatMap((n) => {
        if (typeof n !== 'object') {
          return []
        }
        return Object.entries<any>(n)
          .filter(([key, value]) => key != null && key !== '')
          .map<BodyParam>(([key, value], index) => {
          return {
            partType: mui.bodyParams,
            paramType: paramType,
            description: '',
            name: key,
            isRequired: n.not_null == 1 ? 1 : 0,
            orderNo: index,
            dataType: ApiParamsType[getDataType(value)],
            paramAttr: {
              example: safeStringify(value)
            },
            childList:
              value && typeof value === 'object'
                ? this.transformBodyData(value, paramType)
                : undefined
          }
        })
      })
  }

  handleRequestHeader(headerList): HeaderParam[] {
    return (
      headerList?.parameter?.map((n) => ({
        partType: mui.headerParams,
        paramType: PARAM_TYPE.input,
        name: n.key?.slice(0, 100) || '',
        example: n.value,
        isRequired: n.not_null == 1 ? 1 : 0,
        dataType: ApiParamsType.string,
        paramAttr: {
          example: safeStringify(n.value)
        },
        description: n.description?.slice(0, 500) as string
      })) || []
    )
  }


}
