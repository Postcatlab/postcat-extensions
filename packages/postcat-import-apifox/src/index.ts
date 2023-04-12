import {APIFoxImporter} from './APIFoxImporter'

export const importFunc = (data) => {
  const apiFoxImporter = new APIFoxImporter(data)

  return [apiFoxImporter.postcatData, null]
}
