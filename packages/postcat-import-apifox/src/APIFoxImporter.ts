import {ApiParamsType, ContentType, mui, PARAM_TYPE, Protocol, RequestMethod} from '../../../shared/src/types/api.model'
import {ApiData, HeaderParam, RequestParams} from '../../../shared/src/types/apiData'
import {CollectionTypeEnum, ImportProjectDto} from '../../../shared/src/types/pcAPI'
import {Group} from "../../../shared/src/types/group";
import {safeStringify} from "../../../shared/src/utils/common";

export class APIFoxImporter {
  postcatData: ImportProjectDto
  apifoxData

  constructor(data) {
    this.apifoxData = data
    this.postcatData = this.transformToPostcat(this.apifoxData)
  }

  transformToPostcat(data): ImportProjectDto {
    // 项目名
    const projectName = data.info?.name
    const projectDescription = data.info?.description
    const collections = [{
      name: projectName || 'Import from Apifox',
      collectionType: CollectionTypeEnum.GROUP,
      children: this.transformItems(data?.apiCollection)
    }]
    const environmentList = this.transformEnv(data?.environments)
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
        hostUri: item?.baseUrl || '',
        // todo env param
        // parameters : item?.parameters?.map((param) => {
        //   return {
        //     name : param?.name || '',
        //     value : param?.value  || ''
        //   }
        // }) || []
      }
    }) || []
  }

  transformItems(items: any): ImportProjectDto['collections'] {
    return items?.map((item) => {
      // 处理分组
      if (!item.api) {
        // 没有api属性就是分组
        return {
          // 名字
          name: item.name,
          collectionType: CollectionTypeEnum.GROUP,
          // 递归处理子节点
          children:
            Array.isArray(item.items) && item.items.length
              ? this.transformItems(item.items)
              : []
        } as Group
      } else if (item.api) {
        const apiName = item.name;
        const api: any = item.api;
        const apiUri = api?.path || '$' + item.name;
        const apiProtocol = Protocol.HTTP;
        const apiMethod = api.method as string;
        return {
          collectionType: CollectionTypeEnum.API_DATA,
          name: apiName,
          uri: apiUri,
          protocol: apiProtocol,
          apiAttrInfo: {
            requestMethod: RequestMethod[apiMethod?.toUpperCase() || 'GET'],
            contentType: this.handleRequestBodyType(api?.requestBody)
          },
          requestParams: {
            headerParams: this.handleRequestHeader(api?.parameters?.header),
            queryParams: this.handleQueryParams(api?.parameters?.query),
            restParams: this.handleRestParams(api?.parameters?.path),
            bodyParams: this.handleBodyParams(api?.requestBody, PARAM_TYPE.input)
            // bodyParams: []
          },
          responseList: [
            {
              isDefault: 1,
              contentType: this.handleResponseBodyType(api.responses?.[0] || {}),
              responseParams: {
                // 没有header
                headerParams: [],
                bodyParams: this.handleJsonBody(api.responses?.[0]?.jsonSchema || {}, PARAM_TYPE.output)
                // bodyParams: []
              }
            }
          ]
        } as ApiData
      } else {
        console.error("unknown collection_type");
        return {} as Group;
      }
    }) || []
  }


  handleQueryParams(queryList): RequestParams['queryParams'] {
    return (
      queryList?.map((n) => ({
        partType: mui.queryParams,
        paramType: PARAM_TYPE.input,
        name: n.name?.slice(0, 100) || '',
        dataType: ApiParamsType[n.type.toLowerCase()],
        isRequired: n.required ? 1 : 0,
        description: n.description?.slice(0, 500) as string || '',
        paramAttr: {
          example: n.value || ''
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
        dataType: ApiParamsType.string,
        isRequired: n.required == 1 ? 1 : 0,
        description: n.description?.slice(0, 500) as string || '',
        paramAttr: {
          example: n.example || ''
        }
      })) || []
    )
  }


  handleRequestBodyType(requestBody): ContentType {
    switch (requestBody.type) {
      case 'text/plain':
        return ContentType.RAW
      case 'application/json':
        return requestBody?.jsonSchema?.type === "object"
          ? ContentType.JSON_OBJECT
          : ContentType.JSON_ARRAY
      case 'application/xml':
        return ContentType.XML
      case 'application/x-www-form-urlencoded':
        return ContentType.FROM_DATA
      default:
        return ContentType.JSON_OBJECT
    }
  }

  handleResponseBodyType(res): ContentType {
    let type;
    if (res?.contentType?.includes("json")) {
      type = "application/json";
    } else if (res?.contentType?.includes("xml")) {
      type = "application/xml";
    } else {
      type = "text/plain"
    }
    return this.handleRequestBodyType({
      type: type,
      jsonSchema: res?.jsonSchema || {}
    });
  }

  handleBodyParams(requestBody, paramType) {
    const ct = this.handleRequestBodyType(requestBody);
    if ('parameters' in requestBody && ct == ContentType.FROM_DATA) {
      return this.handleFormDataBody(requestBody.parameters, paramType)
    }
    if ('example' in requestBody && ct == ContentType.RAW) {
      return this.handleRawBody(requestBody.example, paramType)
    } else {
      // default json
      return this.handleJsonBody(requestBody.jsonSchema, paramType)
    }
  }

  handleRawBody(example, paramType) {
    return [{
      partType: mui.bodyParams,
      paramType: paramType,
      dataType: ApiParamsType.string,
      binaryRawData: example,
      isRequired: 1,
      paramAttr: {
        example: example || ''
      },
    }]
  }

  handleFormDataBody(parameters, paramType) {
    return (
      parameters?.map((n) => ({
        partType: mui.bodyParams,
        paramType: paramType,
        description: n.description?.slice(0, 500) as string || '',
        name: n.name.slice(0, 100) || '',
        dataType: ApiParamsType[n.type as string],
        isRequired: n.required ? 1 : 0,
        paramAttr: {
          example: n.example || ''
        },
      })) || []
    )
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

  handleRequestHeader(headerList): HeaderParam[] {
    return (
      headerList?.map((n) => ({
        partType: mui.headerParams,
        paramType: PARAM_TYPE.input,
        name: n.name?.slice(0, 100) || '',
        isRequired: n.required ? 1 : 0,
        dataType: ApiParamsType.string,
        paramAttr: {
          example: safeStringify(n.example)
        },
        description: n.description?.slice(0, 500) as string || ''
      })) || []
    )
  }

}
