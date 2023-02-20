import { importFunc } from "../../postcat-import-openapi/"

export const syncFunc = async () => {
  const { url, key, value } = globalThis.pc.getProjectSettings()

  let swaggerJson

  try {
     swaggerJson = await fetch(url).then(res => res.json())
  } catch (error) {
    return [null, error]
  }

  const [apiDatas, importErr] = importFunc(swaggerJson)

  if (importErr) {
    return [apiDatas, importErr]
  }

 return globalThis.pc.updateAPIData(apiDatas)
}
