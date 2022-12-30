import { EolinkImporter } from './EolinkImporter'

export const importFunc = (data) => {
  const postmanImporter = new EolinkImporter(data)
  console.log(
    'EolinkImporter.postcatData22',
    JSON.parse(JSON.stringify(postmanImporter.postcatData))
  )
  return [postmanImporter.postcatData, null]
}
