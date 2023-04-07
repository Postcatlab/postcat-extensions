import {APIPostImporter} from './APIPostImporter'

export const importFunc = (data) => {
  const apiPostImporter = new APIPostImporter(data)

  return [apiPostImporter.postcatData, null]
}
