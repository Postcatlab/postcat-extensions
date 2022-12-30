import type { OpenAPIV3 } from 'openapi-types'
import { OpenAPIParser } from '../../postcat-import-openapi/src/OpenAPIParser'

export const importFunc = (openapi: OpenAPIV3.Document) => {
  if (Object.keys(openapi).length === 0) {
    return [null, { msg: '请上传合法的文件' }]
  }
  if (!openapi.openapi) {
    return [null, { msg: '文件不合法，缺乏 openapi 字段' }]
  }

  console.log('openapi', openapi)

  const data = new OpenAPIParser(openapi).data
  console.log('import res', structuredClone(data))
  return [data, null]
}
