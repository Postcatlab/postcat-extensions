const fs = require('node:fs/promises')
const path = require('node:path')

const pkgName = 'eoapi-opendlp'

// opendlp 官方示例请求参数
const params = {
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
  uri: 'http://8.219.85.124:3000/userinfo/bankcard'
}

const keyMap = {
  uriList: 'API路径',
  descriptionList: '描述',
  queryParamsList: '查询参数',
  restParamsList: '路径参数',
  requestBodyList: '请求体',
  responseBodyList: '响应体'
}

const protoFilePath = path.join(__dirname, './protos/sensitive.proto')

// 假数据
const data = {
  status: {
    code: 0,
    msg: '敏感API文档扫描成功。'
  },
  result: {
    uriList: [
      {
        sensitiveType: 'BANK_CARD',
        key: '[]',
        start: 35,
        end: 43
      }
    ],
    descriptionList: [],
    queryParamsList: [],
    restParamsList: [],
    requestBodyList: [],
    responseBodyList: [
      {
        sensitiveType: 'EMAIL',
        key: '[0, "example"]',
        start: 0,
        end: 12
      },
      {
        sensitiveType: 'EMAIL',
        key: '[1, "children", 1, "example"]',
        start: 0,
        end: 12
      },
      {
        sensitiveType: 'MOBILE_PHONE',
        key: '[2, "example"]',
        start: 0,
        end: 0
      }
    ]
  }
}

const sercurityCheck = async (model) => {
  model.response_body = JSON.stringify(model.responseBody)
  const docs = JSON.stringify(model)

  const serverUrl = window.eo?.getExtensionSettings(`${pkgName}.serverUrl`)
  if (serverUrl) {
    const protoFile = await fs.readFile(protoFilePath)
    const Grpc = window.eo.Grpc
    const [res, err] = await Grpc.send(
      {
        proto: protoFile.toString(),
        url: serverUrl,
        packages: 'hitszids.wf.opendlp.api.v1',
        method: 'SensitiveAPIScan',
        params
      }
    )
    // console.log('docs', docs)
    console.log('==>>', res)

    if (Object.is(res.at?.(0), null)) {
      return window.eo.modalService.create({
        nzTitle: '提示',
        nzCancelText: null,
        nzContent: res.at?.(1).details || '操作失败'
      })
    }

    const modal = window.eo.modalService.create({
      nzTitle: 'API敏感词',
      nzCancelText: null,
      nzContent: `<div class="opendlp-table"></div>`,
      nzOnOk() {
        modal.destroy()
      }
    })

    requestIdleCallback(() => {
      // 假数据覆盖真实数据
      res.result = data.result
      document.querySelector('.opendlp-table').innerHTML = generateTable(
        res.result
      )
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

const getFieldPosAndValue = (key = '', origin = params.response_body) => {
  const arr = JSON.parse(key).slice(0, -1)
  const { pos, resBody } = arr.reduce(
    (obj, field, index) => {
      const target = obj.resBody[field]
      const name = Array.isArray(target)
        ? obj.resBody.type === 'array'
          ? `[${arr[index + 1]}]`
          : null
        : target?.name
      return {
        pos: name ? `${obj.pos}.${name}` : obj.pos,
        resBody: target
      }
    },
    { pos: '', resBody: origin }
  )
  return [pos.slice(1), resBody.example]
}

const getUriPosAndValue = (uri = '', obj = {}) => {
  const { start = 0, end = 0 } = obj
  const replaceStr = uri.slice(start, end)
  const str = uri.replace(
    replaceStr,
    `<span style="color: red">${replaceStr}</span>`
  )

  return [str, replaceStr]
}

const generateTable = (data) => {
  const content = `
      <style>
      .opendlp-table table {
        table-layout: fixed;
        width: 100%;
        margin: 0 auto;
        border-collapse: collapse;
        border:1px solid #ccc;
      }

      .opendlp-table thead {
        height: 33px;
        font-weight: bold;
        color: rgb(16, 16, 16);
        background: rgb(223, 223, 225);
      }

      .opendlp-table td,
      .opendlp-table th {
        text-align: center;
      }


      </style>
      <table rules=all>
      <thead>
        <tr>
          <th>API位置</th>
          <th>字段位置</th>
          <th>类型</th>
          <th>值</th>
        </tr>
      </thead>
      ${Object.entries(data).reduce((prev, [key, arr]) => {
        arr.forEach((item) => {
          const [pos, value] =
            key === 'uriList'
              ? getUriPosAndValue(params.uri, item)
              : getFieldPosAndValue(item.key)
          prev += `
          <tr>
            <td>${keyMap[key]}</td>
            <td>${pos}</td>
            <td>${item.sensitiveType}</td>
            <td>${value}</td>
          </tr>`
        })
        return prev
      }, '')}
    </table>
    `

  return content
}

module.exports = {
  sercurityCheck
}
