import { importFunc } from "../../postcat-import-openapi/src"
import pkgInfo from '../package.json'  

function b64EncodeUnicode(str) {
  return btoa(unescape(encodeURIComponent(str)))
}

export const pullAPI = async () => {
  const data = await pc.getProjectSettings(pkgInfo.name)
  const { url, basicAuth, basicAuthKey, basicAuthValue } = data
  
  let swaggerJson

  try {
    const headers = {} as Record<string, any> 
    if (basicAuth && basicAuthKey && basicAuthValue) {
      headers.Authorization = `Basic ${b64EncodeUnicode(`${basicAuthKey}:${basicAuthValue}`)}`
    }
    console.log('headers', headers, data, url) 
      const response = await globalThis.fetch?.(url, {headers})

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
