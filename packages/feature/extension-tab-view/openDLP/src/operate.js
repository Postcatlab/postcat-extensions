const fs = require('node:fs/promises')
const path = require('node:path')

const pkgName = 'eoapi-opendlp'

const params = JSON.stringify({
  description: 'eu mollit id',
  doc_type: 1,
  response_body: [
    {
      name: 'string',
      value: 'string',
      description: '',
      type: 'string',
      required: true,
      example: 'hello@qq.com'
    },
    {
      name: 'array',
      required: true,
      example: '',
      type: 'array',
      description: '',
      children: [
        {
          name: 'dom1',
          value: '',
          description: '',
          type: 'string',
          required: true,
          example: ''
        },
        {
          name: 'email',
          value: '',
          description: '',
          type: 'string',
          required: true,
          example: 'alice@qq.com'
        },
        {
          name: 'dom3',
          value: '',
          description: '',
          type: 'string',
          required: true,
          example: ''
        }
      ]
    },
    {
      name: 'mobile',
      value: '',
      description: '',
      type: 'string',
      required: true,
      example: ''
    }
  ],
  name: 'Get User ID Card',
  uri: 'http://www.weather.com.cn/userinfo/bankcard'
})

const data = [
  {
    apiPos: 'API路径',
    fieldPos: 'person.email',
    type: '银行卡',
    value: 'xxxxxxxxxxx'
  },
  {
    apiPos: '请求体',
    fieldPos: 'person.email',
    type: '日期',
    value: '1949'
  }
]

const protoFilePath = path.join(__dirname, './protos/sensitive.proto')

const sercurityCheck = async (model) => {
  const docs = JSON.stringify(model)
  console.log('docs', docs)
  const serverUrl = window.eo?.getExtensionSettings(`${pkgName}.serverUrl`)
  if (serverUrl) {
    const protoFile = await fs.readFile(protoFilePath)
    const Grpc = window.eo.Grpc
    const [res, err] = await Grpc.send(
      {
        proto: protoFile.toString(),
        url: serverUrl,
        name: 'hitszids.wf.opendlp.api.v1'
      },
      {
        next: (client, resolve) => {
          client.SensitiveAPIScan(docs, (err, response) => {
            if (err) {
              resolve([null, err])
              return
            }
            resolve([response, null])
          })
        }
      }
    )
    console.log('==>>', res)

    const modal = window.eo.modalService.create({
      nzTitle: 'API敏感词',
      nzCancelText: null,
      nzContent: `
      <table>
        <tr>
          <th>API位置</th>
          <th>字段位置</th>
          <th>类型</th>
          <th>值</th>
        </tr>
        ${data.reduce((prev, curr) => {
          return (
            prev +
            `<tr>
              <td>${curr.apiPos}</td>
              <td>${curr.fieldPos}</td>
              <td>${curr.type}</td>
              <td>${curr.value}</td>
            </tr>`
          )
        }, '')}
      </table>
      `,
      nzOnOk() {
        modal.destroy()
      }
    })
  } else {
    const modal = window.eo.modalService.create({
      nzTitle: '跳转设置页配置openDLP服务？',
      nzContent:
        '您还没有配置openDLP服务地址，目前无法使用本插件，是否要跳转到配置页？',
      nzOkText: '跳转配置',
      nzOnOk() {
        // 'http://localhost:4200/#/home/extension/detail?id=eoapi-extension-samples-vue3&name=eoapi-extension-samples-vue3&tab=0'
        window.eo?.navigate(['home/extension/detail'], {
          queryParams: {
            type: '',
            id: pkgName,
            name: pkgName,
            tab: 1
          }
        })
        modal.destroy()
      }
    })
  }
}

module.exports = {
  sercurityCheck
}
