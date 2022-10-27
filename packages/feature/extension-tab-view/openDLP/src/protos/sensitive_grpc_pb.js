// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var sensitive_pb = require('./sensitive_pb.js');

function serialize_hitszids_wf_opendlp_api_v1_SensitiveAPIScanRequest(arg) {
  if (!(arg instanceof sensitive_pb.SensitiveAPIScanRequest)) {
    throw new Error('Expected argument of type hitszids.wf.opendlp.api.v1.SensitiveAPIScanRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hitszids_wf_opendlp_api_v1_SensitiveAPIScanRequest(buffer_arg) {
  return sensitive_pb.SensitiveAPIScanRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_hitszids_wf_opendlp_api_v1_SensitiveAPIScanResponse(arg) {
  if (!(arg instanceof sensitive_pb.SensitiveAPIScanResponse)) {
    throw new Error('Expected argument of type hitszids.wf.opendlp.api.v1.SensitiveAPIScanResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hitszids_wf_opendlp_api_v1_SensitiveAPIScanResponse(buffer_arg) {
  return sensitive_pb.SensitiveAPIScanResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_hitszids_wf_opendlp_api_v1_StringMaskRequest(arg) {
  if (!(arg instanceof sensitive_pb.StringMaskRequest)) {
    throw new Error('Expected argument of type hitszids.wf.opendlp.api.v1.StringMaskRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hitszids_wf_opendlp_api_v1_StringMaskRequest(buffer_arg) {
  return sensitive_pb.StringMaskRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_hitszids_wf_opendlp_api_v1_StringMaskResponse(arg) {
  if (!(arg instanceof sensitive_pb.StringMaskResponse)) {
    throw new Error('Expected argument of type hitszids.wf.opendlp.api.v1.StringMaskResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hitszids_wf_opendlp_api_v1_StringMaskResponse(buffer_arg) {
  return sensitive_pb.StringMaskResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_hitszids_wf_opendlp_api_v1_StringMaskWithAnalyzeResultRequest(arg) {
  if (!(arg instanceof sensitive_pb.StringMaskWithAnalyzeResultRequest)) {
    throw new Error('Expected argument of type hitszids.wf.opendlp.api.v1.StringMaskWithAnalyzeResultRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hitszids_wf_opendlp_api_v1_StringMaskWithAnalyzeResultRequest(buffer_arg) {
  return sensitive_pb.StringMaskWithAnalyzeResultRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_hitszids_wf_opendlp_api_v1_StringMaskWithAnalyzeResultResponse(arg) {
  if (!(arg instanceof sensitive_pb.StringMaskWithAnalyzeResultResponse)) {
    throw new Error('Expected argument of type hitszids.wf.opendlp.api.v1.StringMaskWithAnalyzeResultResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hitszids_wf_opendlp_api_v1_StringMaskWithAnalyzeResultResponse(buffer_arg) {
  return sensitive_pb.StringMaskWithAnalyzeResultResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_hitszids_wf_opendlp_api_v1_StringSensitiveAnalyzeRequest(arg) {
  if (!(arg instanceof sensitive_pb.StringSensitiveAnalyzeRequest)) {
    throw new Error('Expected argument of type hitszids.wf.opendlp.api.v1.StringSensitiveAnalyzeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hitszids_wf_opendlp_api_v1_StringSensitiveAnalyzeRequest(buffer_arg) {
  return sensitive_pb.StringSensitiveAnalyzeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_hitszids_wf_opendlp_api_v1_StringSensitiveAnalyzeResponse(arg) {
  if (!(arg instanceof sensitive_pb.StringSensitiveAnalyzeResponse)) {
    throw new Error('Expected argument of type hitszids.wf.opendlp.api.v1.StringSensitiveAnalyzeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hitszids_wf_opendlp_api_v1_StringSensitiveAnalyzeResponse(buffer_arg) {
  return sensitive_pb.StringSensitiveAnalyzeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var OpenDlpServiceService = exports.OpenDlpServiceService = {
  // 字符串敏感数据识别
stringSensitiveAnalyze: {
    path: '/hitszids.wf.opendlp.api.v1.OpenDlpService/StringSensitiveAnalyze',
    requestStream: false,
    responseStream: false,
    requestType: sensitive_pb.StringSensitiveAnalyzeRequest,
    responseType: sensitive_pb.StringSensitiveAnalyzeResponse,
    requestSerialize: serialize_hitszids_wf_opendlp_api_v1_StringSensitiveAnalyzeRequest,
    requestDeserialize: deserialize_hitszids_wf_opendlp_api_v1_StringSensitiveAnalyzeRequest,
    responseSerialize: serialize_hitszids_wf_opendlp_api_v1_StringSensitiveAnalyzeResponse,
    responseDeserialize: deserialize_hitszids_wf_opendlp_api_v1_StringSensitiveAnalyzeResponse,
  },
  // API文档中的敏感API扫描
sensitiveAPIScan: {
    path: '/hitszids.wf.opendlp.api.v1.OpenDlpService/SensitiveAPIScan',
    requestStream: false,
    responseStream: false,
    requestType: sensitive_pb.SensitiveAPIScanRequest,
    responseType: sensitive_pb.SensitiveAPIScanResponse,
    requestSerialize: serialize_hitszids_wf_opendlp_api_v1_SensitiveAPIScanRequest,
    requestDeserialize: deserialize_hitszids_wf_opendlp_api_v1_SensitiveAPIScanRequest,
    responseSerialize: serialize_hitszids_wf_opendlp_api_v1_SensitiveAPIScanResponse,
    responseDeserialize: deserialize_hitszids_wf_opendlp_api_v1_SensitiveAPIScanResponse,
  },
  // 字符串敏感数据脱敏
stringMaskWithAnalyzeResult: {
    path: '/hitszids.wf.opendlp.api.v1.OpenDlpService/StringMaskWithAnalyzeResult',
    requestStream: false,
    responseStream: false,
    requestType: sensitive_pb.StringMaskWithAnalyzeResultRequest,
    responseType: sensitive_pb.StringMaskWithAnalyzeResultResponse,
    requestSerialize: serialize_hitszids_wf_opendlp_api_v1_StringMaskWithAnalyzeResultRequest,
    requestDeserialize: deserialize_hitszids_wf_opendlp_api_v1_StringMaskWithAnalyzeResultRequest,
    responseSerialize: serialize_hitszids_wf_opendlp_api_v1_StringMaskWithAnalyzeResultResponse,
    responseDeserialize: deserialize_hitszids_wf_opendlp_api_v1_StringMaskWithAnalyzeResultResponse,
  },
  // 字符串敏感数据分析与脱敏
stringMask: {
    path: '/hitszids.wf.opendlp.api.v1.OpenDlpService/StringMask',
    requestStream: false,
    responseStream: false,
    requestType: sensitive_pb.StringMaskRequest,
    responseType: sensitive_pb.StringMaskResponse,
    requestSerialize: serialize_hitszids_wf_opendlp_api_v1_StringMaskRequest,
    requestDeserialize: deserialize_hitszids_wf_opendlp_api_v1_StringMaskRequest,
    responseSerialize: serialize_hitszids_wf_opendlp_api_v1_StringMaskResponse,
    responseDeserialize: deserialize_hitszids_wf_opendlp_api_v1_StringMaskResponse,
  },
};

exports.OpenDlpServiceClient = grpc.makeGenericClientConstructor(OpenDlpServiceService);
