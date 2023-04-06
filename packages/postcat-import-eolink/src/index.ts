import { EolinkImporter } from './EolinkImporter'

export const importFunc = (data) => {
  const postmanImporter = new EolinkImporter(data)
  console.log('postmanImporter', postmanImporter)

  return [postmanImporter.postcatData, null]
}
