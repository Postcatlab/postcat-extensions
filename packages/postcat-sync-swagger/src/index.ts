import { importFunc } from "../../postcat-import-openapi/src"
import { name } from '../package.json' assert { type: 'json' }

export const updateAPI = async () => {
  const data = await pc.getProjectSettings(name)
  

  console.log('data', data)

  let swaggerJson

  try {
     const response = await fetch(data.url)
     if (response.status >= 400) {
      return [null, response.statusText]
     }
     swaggerJson = await response.json()
  } catch (error) {
    return [null, error]
  }

  const [result, importErr] = importFunc(swaggerJson) as any

  if (importErr) {
    return [result, importErr]
  }

 return globalThis.pc.updateAPIData(result?.collections)
}
