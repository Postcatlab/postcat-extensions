import * as grpcWeb from 'grpc-web';

import * as src_proto_sensitive_pb from '../../src/proto/sensitive_pb';


export class OpenDlpServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  stringSensitiveAnalyze(
    request: src_proto_sensitive_pb.StringSensitiveAnalyzeRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: src_proto_sensitive_pb.StringSensitiveAnalyzeResponse) => void
  ): grpcWeb.ClientReadableStream<src_proto_sensitive_pb.StringSensitiveAnalyzeResponse>;

  sensitiveAPIScan(
    request: src_proto_sensitive_pb.SensitiveAPIScanRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: src_proto_sensitive_pb.SensitiveAPIScanResponse) => void
  ): grpcWeb.ClientReadableStream<src_proto_sensitive_pb.SensitiveAPIScanResponse>;

  stringMaskWithAnalyzeResult(
    request: src_proto_sensitive_pb.StringMaskWithAnalyzeResultRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: src_proto_sensitive_pb.StringMaskWithAnalyzeResultResponse) => void
  ): grpcWeb.ClientReadableStream<src_proto_sensitive_pb.StringMaskWithAnalyzeResultResponse>;

  stringMask(
    request: src_proto_sensitive_pb.StringMaskRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: src_proto_sensitive_pb.StringMaskResponse) => void
  ): grpcWeb.ClientReadableStream<src_proto_sensitive_pb.StringMaskResponse>;

}

export class OpenDlpServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  stringSensitiveAnalyze(
    request: src_proto_sensitive_pb.StringSensitiveAnalyzeRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<src_proto_sensitive_pb.StringSensitiveAnalyzeResponse>;

  sensitiveAPIScan(
    request: src_proto_sensitive_pb.SensitiveAPIScanRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<src_proto_sensitive_pb.SensitiveAPIScanResponse>;

  stringMaskWithAnalyzeResult(
    request: src_proto_sensitive_pb.StringMaskWithAnalyzeResultRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<src_proto_sensitive_pb.StringMaskWithAnalyzeResultResponse>;

  stringMask(
    request: src_proto_sensitive_pb.StringMaskRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<src_proto_sensitive_pb.StringMaskResponse>;

}

