import { EolinkImporter } from './EolinkImporter'

export const importFunc = (data) => {
  const postmanImporter = new EolinkImporter(data)

  return [postmanImporter.postcatData, null]
}
