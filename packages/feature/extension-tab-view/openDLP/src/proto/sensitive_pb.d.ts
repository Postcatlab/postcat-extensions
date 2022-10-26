import * as jspb from 'google-protobuf'



export class StringSensitiveAnalyzeRequest extends jspb.Message {
  getToAnalyzeString(): string;
  setToAnalyzeString(value: string): StringSensitiveAnalyzeRequest;

  getStringType(): InputStringType;
  setStringType(value: InputStringType): StringSensitiveAnalyzeRequest;

  getEntitiesList(): Array<PredefinedSensitiveType>;
  setEntitiesList(value: Array<PredefinedSensitiveType>): StringSensitiveAnalyzeRequest;
  clearEntitiesList(): StringSensitiveAnalyzeRequest;
  addEntities(value: PredefinedSensitiveType, index?: number): StringSensitiveAnalyzeRequest;

  getNotUseNlp(): boolean;
  setNotUseNlp(value: boolean): StringSensitiveAnalyzeRequest;

  getUserDefineRuleYamlString(): string;
  setUserDefineRuleYamlString(value: string): StringSensitiveAnalyzeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StringSensitiveAnalyzeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StringSensitiveAnalyzeRequest): StringSensitiveAnalyzeRequest.AsObject;
  static serializeBinaryToWriter(message: StringSensitiveAnalyzeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StringSensitiveAnalyzeRequest;
  static deserializeBinaryFromReader(message: StringSensitiveAnalyzeRequest, reader: jspb.BinaryReader): StringSensitiveAnalyzeRequest;
}

export namespace StringSensitiveAnalyzeRequest {
  export type AsObject = {
    toAnalyzeString: string,
    stringType: InputStringType,
    entitiesList: Array<PredefinedSensitiveType>,
    notUseNlp: boolean,
    userDefineRuleYamlString: string,
  }
}

export class StringSensitiveAnalyzeResponse extends jspb.Message {
  getStatus(): Status | undefined;
  setStatus(value?: Status): StringSensitiveAnalyzeResponse;
  hasStatus(): boolean;
  clearStatus(): StringSensitiveAnalyzeResponse;

  getResultList(): Array<StringSensitiveAnalyzeResult>;
  setResultList(value: Array<StringSensitiveAnalyzeResult>): StringSensitiveAnalyzeResponse;
  clearResultList(): StringSensitiveAnalyzeResponse;
  addResult(value?: StringSensitiveAnalyzeResult, index?: number): StringSensitiveAnalyzeResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StringSensitiveAnalyzeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: StringSensitiveAnalyzeResponse): StringSensitiveAnalyzeResponse.AsObject;
  static serializeBinaryToWriter(message: StringSensitiveAnalyzeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StringSensitiveAnalyzeResponse;
  static deserializeBinaryFromReader(message: StringSensitiveAnalyzeResponse, reader: jspb.BinaryReader): StringSensitiveAnalyzeResponse;
}

export namespace StringSensitiveAnalyzeResponse {
  export type AsObject = {
    status?: Status.AsObject,
    resultList: Array<StringSensitiveAnalyzeResult.AsObject>,
  }
}

export class StringSensitiveAnalyzeResult extends jspb.Message {
  getSensitiveType(): string;
  setSensitiveType(value: string): StringSensitiveAnalyzeResult;

  getKey(): string;
  setKey(value: string): StringSensitiveAnalyzeResult;

  getStart(): number;
  setStart(value: number): StringSensitiveAnalyzeResult;

  getEnd(): number;
  setEnd(value: number): StringSensitiveAnalyzeResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StringSensitiveAnalyzeResult.AsObject;
  static toObject(includeInstance: boolean, msg: StringSensitiveAnalyzeResult): StringSensitiveAnalyzeResult.AsObject;
  static serializeBinaryToWriter(message: StringSensitiveAnalyzeResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StringSensitiveAnalyzeResult;
  static deserializeBinaryFromReader(message: StringSensitiveAnalyzeResult, reader: jspb.BinaryReader): StringSensitiveAnalyzeResult;
}

export namespace StringSensitiveAnalyzeResult {
  export type AsObject = {
    sensitiveType: string,
    key: string,
    start: number,
    end: number,
  }
}

export class SensitiveAPIScanRequest extends jspb.Message {
  getUri(): string;
  setUri(value: string): SensitiveAPIScanRequest;

  getDocType(): SensitiveAPIScanRequest.DocType;
  setDocType(value: SensitiveAPIScanRequest.DocType): SensitiveAPIScanRequest;

  getDescription(): string;
  setDescription(value: string): SensitiveAPIScanRequest;

  getQueryParams(): string;
  setQueryParams(value: string): SensitiveAPIScanRequest;

  getRestParams(): string;
  setRestParams(value: string): SensitiveAPIScanRequest;

  getRequestBody(): string;
  setRequestBody(value: string): SensitiveAPIScanRequest;

  getResponseBody(): string;
  setResponseBody(value: string): SensitiveAPIScanRequest;

  getEntitiesList(): Array<PredefinedSensitiveType>;
  setEntitiesList(value: Array<PredefinedSensitiveType>): SensitiveAPIScanRequest;
  clearEntitiesList(): SensitiveAPIScanRequest;
  addEntities(value: PredefinedSensitiveType, index?: number): SensitiveAPIScanRequest;

  getNotUseNlp(): boolean;
  setNotUseNlp(value: boolean): SensitiveAPIScanRequest;

  getUserDefineRuleYamlString(): string;
  setUserDefineRuleYamlString(value: string): SensitiveAPIScanRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SensitiveAPIScanRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SensitiveAPIScanRequest): SensitiveAPIScanRequest.AsObject;
  static serializeBinaryToWriter(message: SensitiveAPIScanRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SensitiveAPIScanRequest;
  static deserializeBinaryFromReader(message: SensitiveAPIScanRequest, reader: jspb.BinaryReader): SensitiveAPIScanRequest;
}

export namespace SensitiveAPIScanRequest {
  export type AsObject = {
    uri: string,
    docType: SensitiveAPIScanRequest.DocType,
    description: string,
    queryParams: string,
    restParams: string,
    requestBody: string,
    responseBody: string,
    entitiesList: Array<PredefinedSensitiveType>,
    notUseNlp: boolean,
    userDefineRuleYamlString: string,
  }

  export enum DocType { 
    DEFAULT = 0,
    EOAPI = 1,
  }
}

export class SensitiveAPIScanResponse extends jspb.Message {
  getStatus(): Status | undefined;
  setStatus(value?: Status): SensitiveAPIScanResponse;
  hasStatus(): boolean;
  clearStatus(): SensitiveAPIScanResponse;

  getResult(): SensitiveAPIScanResult | undefined;
  setResult(value?: SensitiveAPIScanResult): SensitiveAPIScanResponse;
  hasResult(): boolean;
  clearResult(): SensitiveAPIScanResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SensitiveAPIScanResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SensitiveAPIScanResponse): SensitiveAPIScanResponse.AsObject;
  static serializeBinaryToWriter(message: SensitiveAPIScanResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SensitiveAPIScanResponse;
  static deserializeBinaryFromReader(message: SensitiveAPIScanResponse, reader: jspb.BinaryReader): SensitiveAPIScanResponse;
}

export namespace SensitiveAPIScanResponse {
  export type AsObject = {
    status?: Status.AsObject,
    result?: SensitiveAPIScanResult.AsObject,
  }
}

export class SensitiveAPIScanResult extends jspb.Message {
  getUriList(): Array<StringSensitiveAnalyzeResult>;
  setUriList(value: Array<StringSensitiveAnalyzeResult>): SensitiveAPIScanResult;
  clearUriList(): SensitiveAPIScanResult;
  addUri(value?: StringSensitiveAnalyzeResult, index?: number): StringSensitiveAnalyzeResult;

  getDescriptionList(): Array<StringSensitiveAnalyzeResult>;
  setDescriptionList(value: Array<StringSensitiveAnalyzeResult>): SensitiveAPIScanResult;
  clearDescriptionList(): SensitiveAPIScanResult;
  addDescription(value?: StringSensitiveAnalyzeResult, index?: number): StringSensitiveAnalyzeResult;

  getQueryParamsList(): Array<StringSensitiveAnalyzeResult>;
  setQueryParamsList(value: Array<StringSensitiveAnalyzeResult>): SensitiveAPIScanResult;
  clearQueryParamsList(): SensitiveAPIScanResult;
  addQueryParams(value?: StringSensitiveAnalyzeResult, index?: number): StringSensitiveAnalyzeResult;

  getRestParamsList(): Array<StringSensitiveAnalyzeResult>;
  setRestParamsList(value: Array<StringSensitiveAnalyzeResult>): SensitiveAPIScanResult;
  clearRestParamsList(): SensitiveAPIScanResult;
  addRestParams(value?: StringSensitiveAnalyzeResult, index?: number): StringSensitiveAnalyzeResult;

  getRequestBodyList(): Array<StringSensitiveAnalyzeResult>;
  setRequestBodyList(value: Array<StringSensitiveAnalyzeResult>): SensitiveAPIScanResult;
  clearRequestBodyList(): SensitiveAPIScanResult;
  addRequestBody(value?: StringSensitiveAnalyzeResult, index?: number): StringSensitiveAnalyzeResult;

  getResponseBodyList(): Array<StringSensitiveAnalyzeResult>;
  setResponseBodyList(value: Array<StringSensitiveAnalyzeResult>): SensitiveAPIScanResult;
  clearResponseBodyList(): SensitiveAPIScanResult;
  addResponseBody(value?: StringSensitiveAnalyzeResult, index?: number): StringSensitiveAnalyzeResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SensitiveAPIScanResult.AsObject;
  static toObject(includeInstance: boolean, msg: SensitiveAPIScanResult): SensitiveAPIScanResult.AsObject;
  static serializeBinaryToWriter(message: SensitiveAPIScanResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SensitiveAPIScanResult;
  static deserializeBinaryFromReader(message: SensitiveAPIScanResult, reader: jspb.BinaryReader): SensitiveAPIScanResult;
}

export namespace SensitiveAPIScanResult {
  export type AsObject = {
    uriList: Array<StringSensitiveAnalyzeResult.AsObject>,
    descriptionList: Array<StringSensitiveAnalyzeResult.AsObject>,
    queryParamsList: Array<StringSensitiveAnalyzeResult.AsObject>,
    restParamsList: Array<StringSensitiveAnalyzeResult.AsObject>,
    requestBodyList: Array<StringSensitiveAnalyzeResult.AsObject>,
    responseBodyList: Array<StringSensitiveAnalyzeResult.AsObject>,
  }
}

export class StringMaskWithAnalyzeResultRequest extends jspb.Message {
  getToMaskString(): string;
  setToMaskString(value: string): StringMaskWithAnalyzeResultRequest;

  getSensitiveAnalyzeResultsList(): Array<StringSensitiveAnalyzeResult>;
  setSensitiveAnalyzeResultsList(value: Array<StringSensitiveAnalyzeResult>): StringMaskWithAnalyzeResultRequest;
  clearSensitiveAnalyzeResultsList(): StringMaskWithAnalyzeResultRequest;
  addSensitiveAnalyzeResults(value?: StringSensitiveAnalyzeResult, index?: number): StringSensitiveAnalyzeResult;

  getMaskConfigMap(): jspb.Map<string, MaskConfig>;
  clearMaskConfigMap(): StringMaskWithAnalyzeResultRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StringMaskWithAnalyzeResultRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StringMaskWithAnalyzeResultRequest): StringMaskWithAnalyzeResultRequest.AsObject;
  static serializeBinaryToWriter(message: StringMaskWithAnalyzeResultRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StringMaskWithAnalyzeResultRequest;
  static deserializeBinaryFromReader(message: StringMaskWithAnalyzeResultRequest, reader: jspb.BinaryReader): StringMaskWithAnalyzeResultRequest;
}

export namespace StringMaskWithAnalyzeResultRequest {
  export type AsObject = {
    toMaskString: string,
    sensitiveAnalyzeResultsList: Array<StringSensitiveAnalyzeResult.AsObject>,
    maskConfigMap: Array<[string, MaskConfig.AsObject]>,
  }
}

export class MaskConfig extends jspb.Message {
  getReplace(): MaskConfig.Replace | undefined;
  setReplace(value?: MaskConfig.Replace): MaskConfig;
  hasReplace(): boolean;
  clearReplace(): MaskConfig;

  getCover(): MaskConfig.Cover | undefined;
  setCover(value?: MaskConfig.Cover): MaskConfig;
  hasCover(): boolean;
  clearCover(): MaskConfig;

  getHash(): MaskConfig.Hash | undefined;
  setHash(value?: MaskConfig.Hash): MaskConfig;
  hasHash(): boolean;
  clearHash(): MaskConfig;

  getRedact(): boolean;
  setRedact(value: boolean): MaskConfig;

  getMethodCase(): MaskConfig.MethodCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MaskConfig.AsObject;
  static toObject(includeInstance: boolean, msg: MaskConfig): MaskConfig.AsObject;
  static serializeBinaryToWriter(message: MaskConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MaskConfig;
  static deserializeBinaryFromReader(message: MaskConfig, reader: jspb.BinaryReader): MaskConfig;
}

export namespace MaskConfig {
  export type AsObject = {
    replace?: MaskConfig.Replace.AsObject,
    cover?: MaskConfig.Cover.AsObject,
    hash?: MaskConfig.Hash.AsObject,
    redact: boolean,
  }

  export class Cover extends jspb.Message {
    getCoverChar(): string;
    setCoverChar(value: string): Cover;

    getOffsetStart(): number;
    setOffsetStart(value: number): Cover;

    getOffsetEnd(): number;
    setOffsetEnd(value: number): Cover;

    getCoverLength(): number;
    setCoverLength(value: number): Cover;

    getFromBack(): boolean;
    setFromBack(value: boolean): Cover;

    getIgnoreCharSet(): string;
    setIgnoreCharSet(value: string): Cover;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Cover.AsObject;
    static toObject(includeInstance: boolean, msg: Cover): Cover.AsObject;
    static serializeBinaryToWriter(message: Cover, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Cover;
    static deserializeBinaryFromReader(message: Cover, reader: jspb.BinaryReader): Cover;
  }

  export namespace Cover {
    export type AsObject = {
      coverChar: string,
      offsetStart: number,
      offsetEnd: number,
      coverLength: number,
      fromBack: boolean,
      ignoreCharSet: string,
    }
  }


  export class Replace extends jspb.Message {
    getNewValue(): string;
    setNewValue(value: string): Replace;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Replace.AsObject;
    static toObject(includeInstance: boolean, msg: Replace): Replace.AsObject;
    static serializeBinaryToWriter(message: Replace, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Replace;
    static deserializeBinaryFromReader(message: Replace, reader: jspb.BinaryReader): Replace;
  }

  export namespace Replace {
    export type AsObject = {
      newValue: string,
    }
  }


  export class Hash extends jspb.Message {
    getValue(): MaskConfig.Hash.HashMethod;
    setValue(value: MaskConfig.Hash.HashMethod): Hash;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Hash.AsObject;
    static toObject(includeInstance: boolean, msg: Hash): Hash.AsObject;
    static serializeBinaryToWriter(message: Hash, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Hash;
    static deserializeBinaryFromReader(message: Hash, reader: jspb.BinaryReader): Hash;
  }

  export namespace Hash {
    export type AsObject = {
      value: MaskConfig.Hash.HashMethod,
    }

    export enum HashMethod { 
      SHA256 = 0,
      SHA512 = 1,
      MD5 = 2,
    }
  }


  export enum MethodCase { 
    METHOD_NOT_SET = 0,
    REPLACE = 1,
    COVER = 2,
    HASH = 3,
    REDACT = 4,
  }
}

export class StringMaskWithAnalyzeResultResponse extends jspb.Message {
  getStatus(): Status | undefined;
  setStatus(value?: Status): StringMaskWithAnalyzeResultResponse;
  hasStatus(): boolean;
  clearStatus(): StringMaskWithAnalyzeResultResponse;

  getResult(): string;
  setResult(value: string): StringMaskWithAnalyzeResultResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StringMaskWithAnalyzeResultResponse.AsObject;
  static toObject(includeInstance: boolean, msg: StringMaskWithAnalyzeResultResponse): StringMaskWithAnalyzeResultResponse.AsObject;
  static serializeBinaryToWriter(message: StringMaskWithAnalyzeResultResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StringMaskWithAnalyzeResultResponse;
  static deserializeBinaryFromReader(message: StringMaskWithAnalyzeResultResponse, reader: jspb.BinaryReader): StringMaskWithAnalyzeResultResponse;
}

export namespace StringMaskWithAnalyzeResultResponse {
  export type AsObject = {
    status?: Status.AsObject,
    result: string,
  }
}

export class StringMaskRequest extends jspb.Message {
  getToMaskString(): string;
  setToMaskString(value: string): StringMaskRequest;

  getStringType(): InputStringType;
  setStringType(value: InputStringType): StringMaskRequest;

  getEntitiesList(): Array<PredefinedSensitiveType>;
  setEntitiesList(value: Array<PredefinedSensitiveType>): StringMaskRequest;
  clearEntitiesList(): StringMaskRequest;
  addEntities(value: PredefinedSensitiveType, index?: number): StringMaskRequest;

  getNotUseNlp(): boolean;
  setNotUseNlp(value: boolean): StringMaskRequest;

  getUserDefineRuleYamlString(): string;
  setUserDefineRuleYamlString(value: string): StringMaskRequest;

  getMaskConfigMap(): jspb.Map<string, MaskConfig>;
  clearMaskConfigMap(): StringMaskRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StringMaskRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StringMaskRequest): StringMaskRequest.AsObject;
  static serializeBinaryToWriter(message: StringMaskRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StringMaskRequest;
  static deserializeBinaryFromReader(message: StringMaskRequest, reader: jspb.BinaryReader): StringMaskRequest;
}

export namespace StringMaskRequest {
  export type AsObject = {
    toMaskString: string,
    stringType: InputStringType,
    entitiesList: Array<PredefinedSensitiveType>,
    notUseNlp: boolean,
    userDefineRuleYamlString: string,
    maskConfigMap: Array<[string, MaskConfig.AsObject]>,
  }
}

export class StringMaskResponse extends jspb.Message {
  getStatus(): Status | undefined;
  setStatus(value?: Status): StringMaskResponse;
  hasStatus(): boolean;
  clearStatus(): StringMaskResponse;

  getResult(): string;
  setResult(value: string): StringMaskResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StringMaskResponse.AsObject;
  static toObject(includeInstance: boolean, msg: StringMaskResponse): StringMaskResponse.AsObject;
  static serializeBinaryToWriter(message: StringMaskResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StringMaskResponse;
  static deserializeBinaryFromReader(message: StringMaskResponse, reader: jspb.BinaryReader): StringMaskResponse;
}

export namespace StringMaskResponse {
  export type AsObject = {
    status?: Status.AsObject,
    result: string,
  }
}

export class Status extends jspb.Message {
  getCode(): StatusCode;
  setCode(value: StatusCode): Status;

  getMsg(): string;
  setMsg(value: string): Status;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Status.AsObject;
  static toObject(includeInstance: boolean, msg: Status): Status.AsObject;
  static serializeBinaryToWriter(message: Status, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Status;
  static deserializeBinaryFromReader(message: Status, reader: jspb.BinaryReader): Status;
}

export namespace Status {
  export type AsObject = {
    code: StatusCode,
    msg: string,
  }
}

export enum PredefinedSensitiveType { 
  DEFAULT = 0,
  BANK_CARD = 1,
  DATE = 2,
  DOMAIN_NAME = 3,
  EMAIL = 4,
  ID_CARD = 5,
  IPV4 = 6,
  IPV6 = 7,
  LICENSE_PLATE = 8,
  MAC = 9,
  MOBILE_PHONE = 10,
  PASSPORT = 11,
  POSTCODE = 12,
  SOCIAL_CREDIT_CODE = 13,
  TELEPHONE = 14,
  PERSON = 15,
  COMPANY_NAME = 16,
  LOCATION = 17,
}
export enum InputStringType { 
  UNKNOWN = 0,
  JSON = 1,
  XML = 2,
  OTHER = 3,
}
export enum StatusCode { 
  OK = 0,
  PARAMETER_ERROR = 10000,
  FILE_READ_ERROR = 10001,
  JSON_FILE_PARSE_ERROR = 10002,
  STRING_SENSITIVE_ANALYZE_ERROR = 10003,
  SENSITIVE_API_SCAN_ERROR = 10004,
  STRING_MASK_ERROR = 10005,
  STRING_ANALYZE_MASK_ERROR = 10006,
}
