import { importFunc } from "../../postcat-import-openapi/src"
import { name } from '../package.json' assert { type: 'json' }

export const updateAPI = async () => {
  const data = await pc.getProjectSettings(name)
  

  console.log('data', data)

  let swaggerJson

  try {
     swaggerJson = await fetch(data.url).then(res => res.json())
  } catch (error) {
    return [null, error]
  }

  const [apiDatas, importErr] = importFunc(swaggerJson)

  if (importErr) {
    return [apiDatas, importErr]
  }

 return globalThis.pc.updateAPIData(apiDatas)
}
