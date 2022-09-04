import { EolinkImporter } from './EolinkImporter'
// import { reconvert } from '../../../../../shared/src/utils/common'

export const importFunc = (data) => {
  // const f = eval('(' + reconvert(JSON.stringify(data)) + ')')
  const postmanImporter = new EolinkImporter(JSON.parse(JSON.stringify(data)))
  console.log(
    'EolinkImporter.eoapiData22',
    JSON.parse(JSON.stringify(postmanImporter.eoapiData))
  )
  return [postmanImporter.eoapiData, null]
}
