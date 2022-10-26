// import {
//   tringSensitiveAnalyzeResponse,
//   StringSensitiveAnalyzeRequest
// } from './proto/sensitive_pb'
// import OpenDlpServiceClient  from './proto/sensitive_grpc_web_pb'
const {
  tringSensitiveAnalyzeResponse,
  StringSensitiveAnalyzeRequest
} = require('./proto/sensitive_pb')
const { OpenDlpServiceClient } = require('./proto/sensitive_grpc_web_pb')
var client = new OpenDlpServiceClient('http://192.168.3.16:50051', null, null)

// simple unary call
var request = new StringSensitiveAnalyzeRequest()
request.setToAnalyzeString('王建国的邮箱是wangjg@qq.com')

client.stringSensitiveAnalyze(request, {}, (err, response) => {
  if (err) {
    console.log(
      `Unexpected error for sayHello: code = ${err.code}` +
        `, message = "${err.message}"`
    )
  } else {
    console.log(response.getMessage())
  }
})
