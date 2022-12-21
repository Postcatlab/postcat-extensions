import protoText from 'inline!./src/protos/sensitive.proto'

const pkgName = 'eoapi-opendlp'
const keyMap = {
  uri: 'API 路径',
  description: '描述',
  query_params: 'Query 参数',
  rest_params: 'Rest 参数',
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
const strBySensitiveType = {
  DEFAULT: '默认',
  BANK_CARD: '银行卡',
  DATE: '日期',
  DOMAIN_NAME: '域名',
  EMAIL: '邮箱',
  ID_CARD: '身份证',
  IPV4: 'IPV4',
  IPV6: 'IPV6',
  LICENSE_PLATE: '车牌号',
  MAC: 'MAC地址',
  MOBILE_PHONE: '手机号',
  PASSPORT: '护照',
  POSTCODE: '邮编',
  SOCIAL_CREDIT_CODE: '统一社会信用代码',
  TELEPHONE: '电话号码',
  PERSON: '人名',
  COMPANY_NAME: '公司名',
  LOCATION: '地名'
}
export const sercurityCheck = async (model) => {
  console.log('model', window?.structuredClone?.(model))
  const params = { doc_type: 1 }
  Object.entries(dataToOriginkeyMap).forEach(([key, value]) => {
    if (model[value]) {
      params[key] =
        typeof model[value] === 'string'
          ? model[value]
          : JSON.stringify(model[value])
    }
  })

  const serverUrl = window.eo?.getExtensionSettings(`${pkgName}.serverUrl`)
  if (serverUrl) {
    const Grpc = window.eo.gRPC
    console.log('params', params)

    const modal = window.eo.modalService.create({
      nzTitle: 'API 敏感词',
      nzBodyStyle: {
        maxHeight: '70vh',
        overflow: 'hidden'
      },
      nzContent: `<div class="opendlp-table">正在扫描中...</div>`
    })

    const [res, err] = await Grpc.send({
      proto: protoText,
      url: serverUrl,
      packages: 'hitszids.wf.opendlp.api.v1',
      method: 'SensitiveAPIScan',
      service: 'OpenDlpService',
      params
    })
    console.log('res ==>>', res)
    console.log('err ==>>', err)

    if (res === null || Object.is(res?.at?.(0), null) || err) {
      const errDetails = (res?.at?.(1) || err).details
      return modal.updateConfig({
        nzTitle: '提示',
        nzContent: errDetails ? `服务错误: ${errDetails}` : '扫描失败'
      })
    }
    const opendlpTableEl = document.querySelector('.opendlp-table')!
    if (Object.entries<any>(res.result).some(([_, value]) => value.length)) {
      opendlpTableEl.innerHTML = generateTable(res.result, model)
    } else {
      opendlpTableEl.innerHTML = '暂无敏感词'
    }
  } else {
    const modal = window.eo.modalService.create({
      nzTitle: '跳转设置页配置 openDLP 服务？',
      nzContent:
        '您还没有配置 openDLP 服务地址，目前无法使用本插件，是否要跳转到配置页？',
      nzOkText: '跳转配置',
      nzOnOk() {
        window.eo?.navigate(['home/extension/detail'], {
          queryParams: {
            type: '',
            id: pkgName,
            name: pkgName,
            tab: 0
          }
        })
        modal.destroy()
      }
    })
  }
}

const getFieldPosAndValue = (
  key = '',
  origin,
  obj: Record<string, any> = {}
) => {
  const { start = 0, end = 0 } = obj
  const arr = JSON.parse(key)
  const valueKey = arr.pop()
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
  return [pos.slice(1), (resBody[valueKey] || '').slice(start, end)]
}

const getUriPosAndValue = (uri = '', obj: Record<string, any> = {}) => {
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
        border: 1px solid var(--DIVIDER);
      }
      tbody {
        display: block;
        max-height: 400px;
        overflow: auto;
      }
      .opendlp-table table thead,
      .opendlp-table tbody tr {
        display: table;
        width: 100%;
        table-layout: fixed;
      }
      .opendlp-table thead {
        background-color: var(--TABLE_HEADER_BG);
        font-weight: bold;
        height: 39px;
      }

      .opendlp-table td,
      .opendlp-table th {
        text-align: center;
        height: 38px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }


      </style>
      <table rules="all">
      <thead>
        <tr>
          <th>API 位置</th>
          <th>字段位置</th>
          <th>类型</th>
          <th>值</th>
        </tr>
      </thead>
      ${Object.entries<any[]>(data).reduce((prev, [key, arr]) => {
        arr.forEach((item) => {
          const [pos, value] =
            key === 'uriList'
              ? getUriPosAndValue(model.uri, item)
              : getFieldPosAndValue(
                  item.key,
                  model[dataToOriginkeyMap[key]],
                  item
                )
          const sensitiveType = strBySensitiveType[item.sensitive_type]
          prev += `
          <tr>
            <td>${keyMap[key]}</td>
            <td title="${pos}">${pos}</td>
            <td title="${sensitiveType}">${sensitiveType}</td>
            <td title="${value}">${value}</td>
          </tr>`
        })
        return prev
      }, '')}
    </table>
    `

  return content
}

export default sercurityCheck
