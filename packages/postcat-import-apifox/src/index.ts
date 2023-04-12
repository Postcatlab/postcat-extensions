import {APIFoxImporter} from './APIFoxImporter'

export const importFunc = (data) => {
  if (!(data?.apifoxProject) && !(data?.$schema?.app)) {
    return [null, { msg: '文件不合法，该文件不是 Apifox 格式' }]
  }
  console.log('Apifox before PostmanImport', data)
  const apiFoxImporter = new APIFoxImporter(data)
  console.log('Apifox after PostmanImport', apiFoxImporter.postcatData)
  return [apiFoxImporter.postcatData, null]
}
