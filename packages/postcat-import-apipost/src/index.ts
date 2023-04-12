import {APIPostImporter} from './APIPostImporter'

export const importFunc = (data) => {
  // 没有具体标识，空项目也会有这3个元素
  if (!(data.project) || !(data?.apis) || !(data?.envs)) {
    return [null, { msg: '文件不合法，该文件不是 ApiPost 格式' }]
  }
  console.log('ApiPost before PostmanImport', data)
  const apiPostImporter = new APIPostImporter(data)
  console.log('ApiPost after PostmanImport', apiPostImporter.postcatData)
  return [apiPostImporter.postcatData, null]
}
