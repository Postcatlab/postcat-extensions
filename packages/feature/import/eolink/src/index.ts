import { EolinkImporter } from './EolinkImporter'
import { reconvert } from '../../../../../shared/src/utils/common'

export const importFunc = (data) => {
  console.log('reconvert', JSON.parse(reconvert(JSON.stringify(data))))
  const postmanImporter = new EolinkImporter(data)
  console.log(
    'postmanImporter.eoapiData22',
    JSON.parse(JSON.stringify(postmanImporter.eoapiData))
  )
  return [postmanImporter.eoapiData, null]
}
