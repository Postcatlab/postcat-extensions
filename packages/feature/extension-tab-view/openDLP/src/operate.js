const fs = require('node:fs/promises')
const path = require('node:path')

const pkgName = 'eoapi-opendlp'

const keyMap = {
  uri: 'API路径',
  description: '描述',
  query_params: '查询参数',
  rest_params: '路径参数',
  request_body: '请求体',
  response_body: '响应体'
}

const dataToOriginkeyMap = {
  uri: 'uri',
  description: '',
  query_params: 'queryParams',
  rest_params: 'restParams',
  request_body: 'requestBody',
  response_body: 'responseBody'
}

const protoFilePath = path.join(__dirname, './protos/sensitive.proto')

const sercurityCheck = async (model) => {
  const params = JSON.parse(JSON.stringify(model))
  params.request_body = JSON.stringify(model.requestBody)
  params.response_body = JSON.stringify(model.responseBody)

  const serverUrl = window.eo?.getExtensionSettings(`${pkgName}.serverUrl`)
  if (serverUrl) {
    const protoFile = await fs.readFile(protoFilePath)
    const Grpc = window.eo.Grpc
    console.log('params', params)

    const modal = window.eo.modalService.create({
      nzTitle: 'API敏感词',
      nzCancelText: null,
      nzContent: `<div class="opendlp-table">正在扫描中...</div>`,
      nzOnOk() {
        modal.destroy()
      }
    })

    const [res, err] = await Grpc.send({
      proto: protoFile.toString(),
      url: serverUrl,
      packages: 'hitszids.wf.opendlp.api.v1',
      method: 'SensitiveAPIScan',
      params
    })
    console.log('==>>', res)

    if (Object.is(res.at?.(0), null)) {
      return window.eo.modalService.create({
        nzTitle: '提示',
        nzCancelText: null,
        nzContent: res.at?.(1).details || '操作失败'
      })
    }

    document.querySelector('.opendlp-table').innerHTML = generateTable(
      res.result,
      model
    )
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

const getFieldPosAndValue = (key = '', origin) => {
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

const generateTable = (data, model) => {
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
          console.log(item)
          const [pos, value] =
            key === 'uriList'
              ? getUriPosAndValue(params.uri, item)
              : getFieldPosAndValue(item.key, model[dataToOriginkeyMap[key]])
          prev += `
          <tr>
            <td>${keyMap[key]}</td>
            <td>${pos}</td>
            <td>${item.sensitive_type}</td>
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
