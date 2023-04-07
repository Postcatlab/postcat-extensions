// import fs from 'node:fs'
// import postCollectionJson from '../assets/test.postman_collection.json'
import { PostmanImporter } from './postmanImporter'
import { HttpsSchemaGetpostmanComJsonDraft07CollectionV210 } from './types/postman-collection'

// postman 官方类型定义 https://schema.postman.com/

export const importFunc = (
  data: HttpsSchemaGetpostmanComJsonDraft07CollectionV210
) => {
  console.log('before PostmanImport', data)
  if (!data?.info?._postman_id) {
    return [null, { msg: '文件不合法，该文件不是 Postman 格式' }]
  }

  const postmanImporter = new PostmanImporter(data)
  console.log(
    'after PostmanImport',
    JSON.parse(JSON.stringify(postmanImporter.postcatData))
  )

  return [postmanImporter.postcatData, null]
}

// const [data] = importFunc(postCollectionJson)

// console.log('data', data)
// fs.writeFileSync('postman.json', JSON.stringify(data, null, 2))
