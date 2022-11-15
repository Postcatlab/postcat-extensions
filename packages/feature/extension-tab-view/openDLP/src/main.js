const messages = require('./protos/sensitive_pb')
const services = require('./protos/sensitive_grpc_pb')
const grpc = require('@grpc/grpc-js')
const { EOF } = require('dns')

function main() {
  let client = new services.OpenDlpServiceClient(
    '192.168.3.16:50051',
    grpc.credentials.createInsecure()
  )
  let request = new messages.SensitiveAPIScanRequest()
  request.setUri('http://www.weather.com.cn/userinfo/bankcard')
  request.setQueryParams('[]')
  request.setRequestBody('[]')
  request.setRestParams('[]')
  request.setResponseBody('[]')
  request.setDocType(1)
  request.setEntitiesList([])
  request.setNotUseNlp(true)
  request.setUserDefineRuleYamlString('')

  client.sensitiveAPIScan(request, function (err, response) {
    if (err) {
      console.error(`StringSensitiveAnalyze: ${err}`)
      return
    }
    console.log('StringSensitiveAnalyze:', JSON.stringify(response.toObject()))
  })
}
eo.getSettings()

main()
