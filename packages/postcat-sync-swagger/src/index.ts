import { importFunc } from "../../postcat-import-openapi/src"
import pkgInfo from '../package.json' 
import axios, { AxiosHeaders } from 'axios'

function b64EncodeUnicode(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      // @ts-ignore
      return String.fromCharCode(`0x${p1}`);
    })
  );
}

export const pullAPI = async () => {
  const data = await pc.getProjectSettings(pkgInfo.name)
  const { url, basicAuth, basicAuthKey, basicAuthValue } = data
  
 

  let swaggerJson

  try {
    const headers = {} as AxiosHeaders 
    if (basicAuth && basicAuthKey && basicAuthValue) {
      headers.Authorization = `Basic ${b64EncodeUnicode(`${basicAuthKey}:${basicAuthKey}`)}`
    }
    console.log('headers', headers, data, url)
      const result = await axios.get(url, {headers}) 
      if (result.status >= 400) {
        return [null, result.statusText]
       }
      swaggerJson = result.data
      console.log('swaggerJson',swaggerJson)
  } catch (error) {
    return [null, error]
  }

  const [result, importErr] = importFunc(swaggerJson) as any

  if (importErr) {
    return [result, importErr]
  }

 return globalThis.pc.updateAPIData(result?.collections)
}
