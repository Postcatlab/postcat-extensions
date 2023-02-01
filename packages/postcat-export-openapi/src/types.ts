type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export type ProjectInfo = DeepPartial<{
  environmentList: EnvironmentList[]
  apiList: ApiList[]
  groupList: GroupList[]
  id: number
  groupId: number
  spaceId: number
  name: string
  description: string
  type: number
  isArchive: number
  version: string
  postcatVersion: string
  hashkey: string
  status: number
  createType: number
  secretKey: string
  mockApiSetting: string
  duplicateCheckSetting: string
  synchronizeSetting: string
  noticeApiManagerSetting: number
  requestSetting: string
  timeoutLimit: number
  timeoutLimitType: string
  taskId: number
  projectIcon: string
  updateUserId: number
  createUserId: number
  createTime: number
  updateTime: number
  projectUuid: string
}>

export type EnvironmentList = DeepPartial<{
  id: number
  name: string
  createTime: number
  updateTime: number
  hostUri: string
  parameters: string
  projectUuid: string
}>

export type ApiList = DeepPartial<{
  id: number
  apiUuid: string
  groupId: number
  projectId: number
  lifecycle: number
  name: string
  uri: string
  protocol: number
  status: number
  starred: number
  encoding: string
  isShared: number
  tag: string
  orderNum: number
  hashkey: string
  managerId: number
  updateUserId: number
  createUserId: number
  createTime: number
  updateTime: number
  introduction: Introduction
  relation: Relation
  apiAttrInfo: ApiAttrInfo
  dubboApiAttrInfo: DubboApiAttrInfo
  soapApiAttrInfo: SoapApiAttrInfo
  grpcApiAttrInfo: GrpcApiAttrInfo
  requestParams: RequestParams
  responseList: ResponseList[]
  resultList: ResultList[]
}>

export type Introduction = DeepPartial<{
  id: number
  apiUuid: string
  noteType: number
  noteRaw: string
  note: string
  createUserId: number
  updateUserId: number
  createTime: number
  updateTime: number
}>

export type Relation = DeepPartial<{
  id: number
  apiUuid: string
  bindAmtApiId: number
  swaggerId: string
  fileName: string
  fileUrl: string
  fileId: string
  createTime: number
  updateTime: number
}>

export type ApiAttrInfo = DeepPartial<{
  id: number
  apiUuid: string
  beforeInject: string
  afterInject: string
  authInfo: string
  requestMethod: number
  contentType: number
  updateUserId: number
  createUserId: number
}>

export interface DubboApiAttrInfo {
  id: number
  apiUuid: string
  serverHost: string
  interfaceName: string
  methodName: string
  appName: string
  group: string
  version: string
  apiNumber: number
  createUserId: number
  updateUserId: number
}

export interface SoapApiAttrInfo {
  id: number
  apiUuid: string
  beforeInject: string
  afterInject: string
  authInfo: string
  requestMethod: number
  contentType: number
  wsdlContent: string
  testData: string
  soapOperation: string
  soapAction: string
  soapBinding: string
  soapService: string
  createUserId: number
  updateUserId: number
}

export interface GrpcApiAttrInfo {
  id: number
  apiUuid: string
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
  createUserId: number
  updateUserId: number
}

export type RequestParams = DeepPartial<{
  headerParams: HeaderParam[]
  bodyParams: BodyParam[]
  queryParams: QueryParam[]
  restParams: RestParam[]
}>

export type HeaderParam = DeepPartial<{
  id: number
  parentId: number
  apiUuid: string
  responseUuid: string
  name: string
  paramType: number
  partType: number
  dataType: number
  dataTypeValue: string
  structureId: number
  structureParamId: string
  contentType: string
  isRequired: number
  binaryRawData: string
  description: string
  orderNo: number
  isDefault: number
  paramAttr: ParamAttr
  childList: any[]
}>

export type ParamAttr = DeepPartial<{
  id: number
  apiParamId: number
  minLength: number
  maxLength: number
  minValue: MinValue
  maxValue: MaxValue
  paramLimit: string
  paramValueList: string
  paramMock: string
  attr: string
  structureIsHide: number
  example: string
  dbArr: string
  paramNote: string
}>

export interface MinValue {}

export interface MaxValue {}

export type BodyParam = DeepPartial<{
  id: number
  parentId: number
  apiUuid: string
  responseUuid: string
  name: string
  paramType: number
  partType: number
  dataType: number
  dataTypeValue: string
  structureId: number
  structureParamId: string
  contentType: string
  isRequired: number
  binaryRawData: string
  description: string
  orderNo: number
  isDefault: number
  paramAttr: ParamAttr2
  childList: any[]
}>

export type ParamAttr2 = DeepPartial<{
  id: number
  apiParamId: number
  minLength: number
  maxLength: number
  minValue: MinValue2
  maxValue: MaxValue2
  paramLimit: string
  paramValueList: string
  paramMock: string
  attr: string
  structureIsHide: number
  example: string
  dbArr: string
  paramNote: string
}>

export interface MinValue2 {}

export interface MaxValue2 {}

export type QueryParam = DeepPartial<{
  id: number
  parentId: number
  apiUuid: string
  responseUuid: string
  name: string
  paramType: number
  partType: number
  dataType: number
  dataTypeValue: string
  structureId: number
  structureParamId: string
  contentType: string
  isRequired: number
  binaryRawData: string
  description: string
  orderNo: number
  isDefault: number
  paramAttr: ParamAttr3
  childList: any[]
}>

export type ParamAttr3 = DeepPartial<{
  id: number
  apiParamId: number
  minLength: number
  maxLength: number
  minValue: MinValue3
  maxValue: MaxValue3
  paramLimit: string
  paramValueList: string
  paramMock: string
  attr: string
  structureIsHide: number
  example: string
  dbArr: string
  paramNote: string
}>

export interface MinValue3 {}

export interface MaxValue3 {}

export type RestParam = DeepPartial<{
  id: number
  parentId: number
  apiUuid: string
  responseUuid: string
  name: string
  paramType: number
  partType: number
  dataType: number
  dataTypeValue: string
  structureId: number
  structureParamId: string
  contentType: string
  isRequired: number
  binaryRawData: string
  description: string
  orderNo: number
  isDefault: number
  paramAttr: ParamAttr4
  childList: any[]
}>

export type ParamAttr4 = DeepPartial<{
  id: number
  apiParamId: number
  minLength: number
  maxLength: number
  minValue: MinValue4
  maxValue: MaxValue4
  paramLimit: string
  paramValueList: string
  paramMock: string
  attr: string
  structureIsHide: number
  example: string
  dbArr: string
  paramNote: string
}>

export interface MinValue4 {}

export interface MaxValue4 {}

export type ResponseList = DeepPartial<{
  id: number
  responseUuid: string
  apiUuid: string
  oldId: number
  name: string
  httpCode: string
  contentType: number
  isDefault: number
  updateUserId: number
  createUserId: number
  createTime: number
  updateTime: number
  responseParams: ResponseParams
}>

export type ResponseParams = DeepPartial<{
  headerParams: HeaderParam2[]
  bodyParams: BodyParam2[]
  queryParams: QueryParam2[]
  restParams: RestParam2[]
}>

export type HeaderParam2 = DeepPartial<{
  id: number
  parentId: number
  apiUuid: string
  responseUuid: string
  name: string
  paramType: number
  partType: number
  dataType: number
  dataTypeValue: string
  structureId: number
  structureParamId: string
  contentType: string
  isRequired: number
  binaryRawData: string
  description: string
  orderNo: number
  isDefault: number
  paramAttr: ParamAttr5
  childList: any[]
}>

export interface ParamAttr5 {
  id: number
  apiParamId: number
  minLength: number
  maxLength: number
  minValue: MinValue5
  maxValue: MaxValue5
  paramLimit: string
  paramValueList: string
  paramMock: string
  attr: string
  structureIsHide: number
  example: string
  dbArr: string
  paramNote: string
}

export interface MinValue5 {}

export interface MaxValue5 {}

export interface BodyParam2 {
  id: number
  parentId: number
  apiUuid: string
  responseUuid: string
  name: string
  paramType: number
  partType: number
  dataType: number
  dataTypeValue: string
  structureId: number
  structureParamId: string
  contentType: string
  isRequired: number
  binaryRawData: string
  description: string
  orderNo: number
  isDefault: number
  paramAttr: ParamAttr6
  childList: any[]
}

export interface ParamAttr6 {
  id: number
  apiParamId: number
  minLength: number
  maxLength: number
  minValue: MinValue6
  maxValue: MaxValue6
  paramLimit: string
  paramValueList: string
  paramMock: string
  attr: string
  structureIsHide: number
  example: string
  dbArr: string
  paramNote: string
}

export interface MinValue6 {}

export interface MaxValue6 {}

export interface QueryParam2 {
  id: number
  parentId: number
  apiUuid: string
  responseUuid: string
  name: string
  paramType: number
  partType: number
  dataType: number
  dataTypeValue: string
  structureId: number
  structureParamId: string
  contentType: string
  isRequired: number
  binaryRawData: string
  description: string
  orderNo: number
  isDefault: number
  paramAttr: ParamAttr7
  childList: any[]
}

export interface ParamAttr7 {
  id: number
  apiParamId: number
  minLength: number
  maxLength: number
  minValue: MinValue7
  maxValue: MaxValue7
  paramLimit: string
  paramValueList: string
  paramMock: string
  attr: string
  structureIsHide: number
  example: string
  dbArr: string
  paramNote: string
}

export interface MinValue7 {}

export interface MaxValue7 {}

export interface RestParam2 {
  id: number
  parentId: number
  apiUuid: string
  responseUuid: string
  name: string
  paramType: number
  partType: number
  dataType: number
  dataTypeValue: string
  structureId: number
  structureParamId: string
  contentType: string
  isRequired: number
  binaryRawData: string
  description: string
  orderNo: number
  isDefault: number
  paramAttr: ParamAttr8
  childList: any[]
}

export interface ParamAttr8 {
  id: number
  apiParamId: number
  minLength: number
  maxLength: number
  minValue: MinValue8
  maxValue: MaxValue8
  paramLimit: string
  paramValueList: string
  paramMock: string
  attr: string
  structureIsHide: number
  example: string
  dbArr: string
  paramNote: string
}

export interface MinValue8 {}

export interface MaxValue8 {}

export interface ResultList {
  id: number
  apiUuid: string
  name: string
  httpCode: string
  httpContentType: string
  type: number
  content: string
  createUserId: number
  updateUserId: number
  createTime: number
  updateTime: number
}

export type GroupList = DeepPartial<{
  id: number
  moduleGroupId: number
  module: string
  type: number
  name: string
  path: string
  depth: number
  parentId: number
  sort: number
  createTime: number
  updateTime: number
  relationInfos: RelationInfo[]
  children: any[]
}>

export interface RelationInfo {
  apiUuid: string
  apiId: number
  id: number
  lifecycle: number
  name: string
  uri: string
  tag: string
  status: number
  starred: number
  groupId: number
  groupName: string
  projectId: number
  isShared: number
  managerId: number
  updateUserId: number
  createUserId: number
  managerName: string
  updateUserName: string
  createUserName: string
  protocol: number
  requestMethod: number
  contentType: number
  testCaseNum: number
  testSuccessRate: TestSuccessRate
  testStatus: number
  apiCreateTime: number
  apiUpdateTime: number
  createTime: number
  updateTime: number
  orderNum: number
}

export interface TestSuccessRate {}
