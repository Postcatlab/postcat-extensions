const {
  tringSensitiveAnalyzeResponse,
  StringSensitiveAnalyzeRequest
} = require('./proto/sensitive_pb')
const { OpenDlpServiceClient } = require('./proto/sensitive_grpc_web_pb')
var client = new OpenDlpServiceClient('http://192.168.3.16:50051', {"Access-Control-Allow-Origin": "*"}, null)

// simple unary call
var request = new StringSensitiveAnalyzeRequest()
request.setToAnalyzeString(`{
  "entities": [
      15,
      "PERSON",
      "COMPANY_NAME",
      12,
      "DEFAULT"
  ],
  "not_use_nlp": true,
  "string_type": "XML",
  "to_analyze_string": "fugiat laboris qui",
  "user_define_rule_yaml_string": "in eiusmod laborum commodo consectetur"
}`)

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
