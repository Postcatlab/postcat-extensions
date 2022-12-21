import { EolinkImporter } from './EolinkImporter'
// import { reconvert } from '../../../../../shared/src/utils/common'

export const importFunc = (data) => {
  // const f = eval('(' + reconvert(JSON.stringify(data)) + ')')
  const postmanImporter = new EolinkImporter(data)
  console.log(
    'EolinkImporter.postcatData22',
    JSON.parse(JSON.stringify(postmanImporter.postcatData))
  )
  return [postmanImporter.postcatData, null]
}
