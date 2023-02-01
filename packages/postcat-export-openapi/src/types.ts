type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

  export enum CollectionTypeEnum {
    GROUP = 0,
    API_DATA = 1
  }

  export type ProjectInfo = DeepPartial<{
    workSpaceUuid: string
    name: string
    description?: string
    postcatVersion?: string
    projectUuid: string
    environmentList: EnvironmentList[]
    collections: Collection[]
  }>
  
  export type EnvironmentList =DeepPartial<{
    name: string
    hostUri: string
    parameters: string
    projectUuid: string
    workSpaceUuid: string
  }>
  
  export type Collection =DeepPartial<{
    collectionType: number
    id: string
    moduleGroupId?: string
    module?: string
    type?: string
    name: string
    path?: string
    depth?: string
    parentId?: string
    sort?: string
    createTime: string
    updateTime: string
    children?: Collection[]
    groupId?: string
    groupName?: string
    projectId?: string
    lifecycle?: string
    uri?: string
    protocol?: string
    status?: string
    starred?: string
    encoding?: string
    isShared?: string
    tag?: string
    orderNum?: string
    hashkey?: string
    managerId?: string
    managerName?: string
    updateUserId?: string
    updateUserName?: string
    createUserId?: string
    createUserName?: string
    introduction?: Introduction
    relation?: Relation
    apiAttrInfo?: ApiAttrInfo
    dubboApiAttrInfo?: DubboApiAttrInfo
    soapApiAttrInfo?: SoapApiAttrInfo
    grpcApiAttrInfo?: GrpcApiAttrInfo
    requestParams?: RequestParams
    responseList?: ResponseList[]
    resultList?: ResultList[]
  }>
  
  export type Introduction =DeepPartial<{
    apiUuid: string
    noteType: string
    noteRaw: string
    note: string
    createTime: string
    updateTime: string
  }>
  
  export type Relation =DeepPartial<{
    apiUuid: string
    bindAmtApiId: string
    swaggerId: string
    fileName: string
    fileUrl: string
    fileId: string
  }>
  
  export type ApiAttrInfo =DeepPartial<{
    beforeInject: string
    afterInject: string
    authInfo: string
    requestMethod: string
    contentType: string
    createTime: string
    updateTime: string
  }>
  
  export type DubboApiAttrInfo =DeepPartial<{
    serverHost: string
    interfaceName: string
    methodName: string
    appName: string
    group: string
    version: string
    apiNumber: string
    createTime: string
    updateTime: string
  }>
  
  export type SoapApiAttrInfo =DeepPartial<{
    beforeInject: string
    afterInject: string
    authInfo: string
    requestMethod: string
    contentType: string
    wsdlContent: string
    testData: string
    soapOperation: string
    soapAction: string
    soapBinding: string
    soapService: string
    createTime: string
    updateTime: string
  }>
  
  export type GrpcApiAttrInfo =DeepPartial<{
    authInfo: string
    serverHost: string
    interfaceName: string
    methodName: string
    appName: string
    group: string
    version: string
    proto: string
    apiRequestMetadata: string
    responseMetadata: string
    responseTrailingMetadata: string
    createTime: string
    updateTime: string
  }>
  
  export type RequestParams =DeepPartial<{
    headerParams: HeaderParam[]
    bodyParams: BodyParam[]
    queryParams: QueryParam[]
    restParams: RestParam[]
  }>
  
  export type HeaderParam =DeepPartial<{
    responseUuid: string
    name: string
    paramType: string
    partType: string
    dataType: string
    dataTypeValue: string
    structureId: string
    structureParamId: string
    contentType: string
    isRequired: string
    binaryRawData: string
    description: string
    orderNo: string
    createTime: string
    updateTime: string
    paramAttr: ParamAttr
    childList: string
  }>
  
  export type ParamAttr =DeepPartial<{
    minLength: string
    maxLength: string
    minValue: string
    maxValue: string
    paramLimit: string
    paramValueList: string
    paramMock: string
    attr: string
    structureIsHide: string
    example: string
    createTime: string
    updateTime: string
    dbArr: string
    paramNote: string
  }>
  
  export type BodyParam =DeepPartial<{
    responseUuid: string
    name: string
    paramType: string
    partType: string
    dataType: number
    dataTypeValue: string
    structureId: string
    structureParamId: string
    contentType: string
    isRequired: string
    binaryRawData: string
    description: string
    orderNo: string
    createTime: string
    updateTime: string
    paramAttr: ParamAttr2
    childList: BodyParam[]
  }>
  
  export type ParamAttr2 =DeepPartial<{
    minLength: string
    maxLength: string
    minValue: string
    maxValue: string
    paramLimit: string
    paramValueList: string
    paramMock: string
    attr: string
    structureIsHide: string
    example: string
    createTime: string
    updateTime: string
    dbArr: string
    paramNote: string
  }>
  
  export type QueryParam =DeepPartial<{
    responseUuid: string
    name: string
    paramType: string
    partType: string
    dataType: string
    dataTypeValue: string
    structureId: string
    structureParamId: string
    contentType: string
    isRequired: string
    binaryRawData: string
    description: string
    orderNo: string
    createTime: string
    updateTime: string
    paramAttr: ParamAttr3
    childList: QueryParam[]
  }>
  
  export type ParamAttr3 =DeepPartial<{
    minLength: string
    maxLength: string
    minValue: string
    maxValue: string
    paramLimit: string
    paramValueList: string
    paramMock: string
    attr: string
    structureIsHide: string
    example: string
    createTime: string
    updateTime: string
    dbArr: string
    paramNote: string
  }>
  
  export type RestParam =DeepPartial<{
    responseUuid: string
    name: string
    paramType: string
    partType: string
    dataType: string
    dataTypeValue: string
    structureId: string
    structureParamId: string
    contentType: string
    isRequired: string
    binaryRawData: string
    description: string
    orderNo: string
    createTime: string
    updateTime: string
    paramAttr: ParamAttr4
    childList: RestParam[]
  }>
  
  export type ParamAttr4 =DeepPartial<{
    minLength: string
    maxLength: string
    minValue: string
    maxValue: string
    paramLimit: string
    paramValueList: string
    paramMock: string
    attr: string
    structureIsHide: string
    example: string
    createTime: string
    updateTime: string
    dbArr: string
    paramNote: string
  }>
  
  export type ResponseList =DeepPartial<{
    apiUuid: string
    oldId: string
    name: string
    httpCode: string
    contentType: string
    isDefault: string
    createTime: string
    updateTime: string
    responseParams: ResponseParams
  }>
  
  export type ResponseParams =DeepPartial<{
    headerParams: HeaderParam2[]
    bodyParams: BodyParam2[]
    queryParams: QueryParam2[]
    restParams: RestParam2[]
  }>
  
  export type HeaderParam2 =DeepPartial<{
    responseUuid: string
    name: string
    paramType: string
    partType: string
    dataType: string
    dataTypeValue: string
    structureId: string
    structureParamId: string
    contentType: string
    isRequired: string
    binaryRawData: string
    description: string
    orderNo: string
    createTime: string
    updateTime: string
    paramAttr: ParamAttr5
    childList: HeaderParam2[]
  }>
  
  export type ParamAttr5 =DeepPartial<{
    minLength: string
    maxLength: string
    minValue: string
    maxValue: string
    paramLimit: string
    paramValueList: string
    paramMock: string
    attr: string
    structureIsHide: string
    example: string
    createTime: string
    updateTime: string
    dbArr: string
    paramNote: string
  }>
  
  export type BodyParam2 =DeepPartial<{
    responseUuid: string
    name: string
    paramType: string
    partType: string
    dataType: string
    dataTypeValue: string
    structureId: string
    structureParamId: string
    contentType: string
    isRequired: string
    binaryRawData: string
    description: string
    orderNo: string
    createTime: string
    updateTime: string
    paramAttr: ParamAttr6
    childList: BodyParam2[]
  }>
  
  export type ParamAttr6 =DeepPartial<{
    minLength: string
    maxLength: string
    minValue: string
    maxValue: string
    paramLimit: string
    paramValueList: string
    paramMock: string
    attr: string
    structureIsHide: string
    example: string
    createTime: string
    updateTime: string
    dbArr: string
    paramNote: string
  }>
  
  export type QueryParam2 =DeepPartial<{
    responseUuid: string
    name: string
    paramType: string
    partType: string
    dataType: string
    dataTypeValue: string
    structureId: string
    structureParamId: string
    contentType: string
    isRequired: string
    binaryRawData: string
    description: string
    orderNo: string
    createTime: string
    updateTime: string
    paramAttr: ParamAttr7
    childList: QueryParam2[]
  }>
  
  export type ParamAttr7 =DeepPartial<{
    minLength: string
    maxLength: string
    minValue: string
    maxValue: string
    paramLimit: string
    paramValueList: string
    paramMock: string
    attr: string
    structureIsHide: string
    example: string
    createTime: string
    updateTime: string
    dbArr: string
    paramNote: string
  }>
  
  export type RestParam2 =DeepPartial<{
    responseUuid: string
    name: string
    paramType: string
    partType: string
    dataType: string
    dataTypeValue: string
    structureId: string
    structureParamId: string
    contentType: string
    isRequired: string
    binaryRawData: string
    description: string
    orderNo: string
    createTime: string
    updateTime: string
    paramAttr: ParamAttr8
    childList: RestParam2[]
  }>
  
  export type ParamAttr8 =DeepPartial<{
    minLength: string
    maxLength: string
    minValue: string
    maxValue: string
    paramLimit: string
    paramValueList: string
    paramMock: string
    attr: string
    structureIsHide: string
    example: string
    createTime: string
    updateTime: string
    dbArr: string
    paramNote: string
  }>
  
  export type ResultList =DeepPartial<{
    id: string
    name: string
    httpCode: string
    httpContentType: string
    type: string
    content: string
    createTime: string
    updateTime: string
  }>
  