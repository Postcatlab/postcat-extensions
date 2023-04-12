import {ApiParamsType, ContentType, mui, PARAM_TYPE, Protocol, RequestMethod} from '../../../shared/src/types/api.model'
import {ApiData, BodyParam, HeaderParam, RequestParams, ResponseParams} from '../../../shared/src/types/apiData'
import {CollectionTypeEnum, ImportProjectDto} from '../../../shared/src/types/pcAPI'
import {Group} from "../../../shared/src/types/group";
import {getDataType} from "../../postcat-import-postman/src/utils";
import {safeJSONParse, safeStringify} from "../../../shared/src/utils/common";


export class YApiImporter {
  postcatData: ImportProjectDto
  yapiData

  constructor(data) {
    this.yapiData = data
    this.postcatData = this.transformToPostcat(this.yapiData)
  }

  transformToPostcat(data): ImportProjectDto {
    // 项目名
    const projectName = 'Import from YApi'
    const projectDescription = ''
    const collections = [{
      name: projectName || 'Import from YApi',
      collectionType: CollectionTypeEnum.GROUP,
      children: this.transformItems(data)
    }]
    // yapi not have envs
    const environmentList = [];
    return {
      name: projectName,
      description: projectDescription,
      environmentList: environmentList,
      collections,
    }
  }

  transformApis(items: any): ImportProjectDto['collections'] {
    return items?.map((item) => {
      const apiName = item.title;
      // @ts-ignore
      const apiUri = item?.path || '$' + apiName;
      const apiProtocol = Protocol.HTTP;
      const apiMethod = item.method as string;
      const contentType = this.handleRequestBodyType(item?.req_body_type, item.req_body_other);
      const resContentType = this.handleRequestBodyType(item?.res_body_type, item.res_body);
      return {
        collectionType: CollectionTypeEnum.API_DATA,
        name: apiName,
        uri: apiUri,
        protocol: apiProtocol,
        apiAttrInfo: {
          requestMethod: RequestMethod[apiMethod?.toUpperCase() || 'GET'],
          contentType: contentType
        },
        requestParams: {
          headerParams: this.handleRequestHeader(item?.req_headers),
          queryParams: this.handleQueryParams(item?.req_query),
          restParams: this.handleRestParams(item?.req_params),
          bodyParams: this.handleRequestBody(item, contentType)
        },
        responseList: [
          {
            isDefault: 1,
            contentType: resContentType,
            responseParams: {
              // 没有header?
              headerParams: [],
              bodyParams: this.handleResponseBody(item?.res_body, resContentType)
              // bodyParams: []
            }
          }
        ]
      } as ApiData
    }) || []
  }

  transformItems(items: any): ImportProjectDto['collections'] {
    return items?.map((item) => {
      // 处理分组
      return {
        // 名字
        name: item.name,
        collectionType: CollectionTypeEnum.GROUP,
        // 递归处理子节点
        children:
          Array.isArray(item.list) && item.list.length
            ? this.transformApis(item.list)
            : []
      } as Group
    }) || []
  }


  handleQueryParams(queryList): RequestParams['queryParams'] {
    return (
      queryList?.map((n) => ({
        partType: mui.queryParams,
        paramType: PARAM_TYPE.input,
        name: n.name.slice(0, 100) || '',
        // 默认string
        dataType: ApiParamsType.string,
        isRequired: n.required == "1" ? 1 : 0,
        description: n.desc.slice(0, 500) as string,
        paramAttr: {
          example: n.desc || ''
        }
      })) || []
    )
  }

  handleRestParams(restList): RequestParams['restParams'] {
    return (
      restList?.map((n) => ({
        partType: mui.restParams,
        paramType: PARAM_TYPE.input,
        name: n.name.slice(0, 100) || '',
        // 默认string
        dataType: ApiParamsType.string,
        // 无对应默认1
        isRequired: 1,
        description: n.desc.slice(0, 500) as string,
        paramAttr: {
          example: n.desc || ''
        }
      })) || []
    )
  }

  handleRequestBodyType(typeStr, jsonStr): ContentType {
    switch (typeStr) {
      case 'raw':
        return ContentType.RAW
      case 'json': {
        return safeJSONParse(jsonStr)?.type == "array"
          ? ContentType.JSON_ARRAY
          : ContentType.JSON_OBJECT
      }
      case 'xml':
        return ContentType.XML
      case 'file':
        return ContentType.BINARY
      case 'form':
        return ContentType.FROM_DATA
      default:
        return ContentType.JSON_OBJECT
    }
  }

  handleRequestBody(body, contentType: ContentType): RequestParams['bodyParams'] {
    if (contentType == ContentType.BINARY || contentType == ContentType.RAW) {
      return [{
        partType: mui.bodyParams,
        paramType: PARAM_TYPE.input,
        name: '',
        isRequired: 1,
        binaryRawData: body.req_body_other || '',
        paramAttr: {}
      }]
    }
    if (contentType == ContentType.FROM_DATA) {
      return body?.req_body_form.map((item) => ({
        partType: mui.bodyParams,
        paramType: PARAM_TYPE.input,
        name: item.name.slice(0, 100) || '',
        description: item.desc.slice(0, 500) as string,
        isRequired: item.required == "1" ? 1 : 0,
        dataType: ApiParamsType[(item.type as string).toLowerCase()],
        paramAttr: {
          example: item.example || ''
        }
      })) || []
    }
    if (contentType == ContentType.JSON_ARRAY || contentType == ContentType.JSON_OBJECT) {
      // 解析json
      const jsonObj = safeJSONParse(body.req_body_other);
      return this.handleJsonBody(jsonObj, PARAM_TYPE.input);
    }
    console.warn("not support content-type", contentType);
    return []
  }

  handleJsonBody(jsonSchema: {
    required: string[],
    type: string,
    items: {
      type: string
    }
    properties?: Record<string, any>
  }, paramType): RequestParams['bodyParams'] {
    // 判断json是否是array
    if (jsonSchema?.type == "array") {
      if (jsonSchema?.items?.type == "object") {
        // object类型的array，取出items继续解析
        return this.handleJsonBody(jsonSchema.items as any, paramType)
      } else {
        // 普通类型的array
        console.warn("normal json_array")
        return []
      }
    } else {
      // 解析json_object
      return (
        (Object.entries(jsonSchema?.properties || {})).map(([key, value]) => (
          {
            partType: mui.bodyParams,
            paramType: paramType,
            description: value.description?.slice(0, 500) as string || '',
            name: key?.slice(0, 100) || '',
            dataType: ApiParamsType[(value.type as string)],
            isRequired: this.checkRequired(jsonSchema.required, key),
            paramAttr: {
              example: value.examples?.[0] || ''
            },
            childList:
            // 对象处理
              value.type == "object" ? this.handleJsonBody(value, paramType)
                // 数组处理
                : (value.type == "array" && value.items && value.items.type == "object"
                  ? this.handleJsonBody(value.items, paramType)
                  : [])

          })) || []
      );
    }
  }

  checkRequired(required: string[], key: string): number {
    return required?.includes(key) ? 1 : 0;
  }

  handleResponseBody(res: any, contentType: ContentType): ResponseParams['bodyParams'] {
    if (contentType == ContentType.RAW) {
      return [
        {
          partType: mui.bodyParams,
          paramType: PARAM_TYPE.output,
          name: '',
          isRequired: 1,
          binaryRawData: res,
          paramAttr: {}
        }
      ]
    } else if (contentType == ContentType.JSON_OBJECT || contentType == ContentType.JSON_ARRAY) {
      // 解析json
      const jsonObj = safeJSONParse(res);
      return this.handleJsonBody(jsonObj, PARAM_TYPE.output);
    }
    console.warn("not support content-type", contentType);
    return []
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
      headerList?.map((n) => ({
        partType: mui.headerParams,
        paramType: PARAM_TYPE.input,
        name: n.name?.slice(0, 100) || '',
        example: n.value,
        isRequired: n.required == "1" ? 1 : 0,
        dataType: ApiParamsType.string,
        paramAttr: {
          example: safeStringify(n.value)
        },
        description: n.value?.slice(0, 500) as string
      })) || []
    )
  }


}
