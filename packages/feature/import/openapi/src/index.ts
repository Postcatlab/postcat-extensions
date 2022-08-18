type methodType = {
  tags: Array<string>
  summary: string
  operationId: string
  requestBody: {
    description?: string
    required?: boolean
    content: {
      [key: string]: {
        schema: {}
      }
    }
  }
  responses: {
    default: {
      description: string
      content: {}
    }
  }
  security: Array<{}>
  'x-codegen-request-body-name'?: string
}
type openAPIType = {
  openapi: string
  info: {
    title: string
    description: string
    version: string
    license: { name: string; url: string }
    contact: {}
    termsOfService: {}
  }
  externalDocs: { description: string; url: string }
  servers: Array<object>
  tags: Array<{
    name: string
    description: string
    externalDocs: { description: string; url: string }
  }>
  paths: {
    [key: string]: {
      get?: methodType
      post?: methodType
      put?: methodType
      delete?: methodType
      option?: methodType
    }
  }
  components: {
    schemas: {}
    securitySchemes?: {}
  }
}
const bodyTypeHash = new Map().set('object', 'json')
const structMap = new Map()

const parserParameters = (list: any[] = []) => {
  const queryParams = list.filter((it) => it.in === 'path')
  const restParams = list.filter((it) => it.in === 'query')
  const requestHeaders = list.filter((it) => it.in === 'header')
  return {
    queryParams,
    restParams,
    requestHeaders
  }
}

// const parserItems = (data) => {
//   return {}
// }

const parserResponses = (data) => {
  if (!data) {
    console.log('Data is Empty')
    return {
      responseBodyType: ''
    }
  }
  const { content } = data
  // * contentList => ['*/*', 'application/json', 'application/xml']

  // * 仅取第一项
  const { schema }: any = Object.values(content).at(0)
  if (schema == null) {
    return {
      responseBodyType: '',
      responseBody: []
    }
  }
  if (schema['$ref']) {
    const { properties, required, type } = structMap.get(
      (schema['$ref'] as string).split('/').at(-1)
    )
    return {
      responseBodyType: bodyTypeHash.get(type) || 'json',
      responseBodyJsonType: type,
      responseBody: parserProperties(properties, required)
    }
  }
}

const parserItems = (path) => {
  if (path == null) {
    return {}
  }
  const { type, properties } = structMap.get((path as string).split('/').at(-1))
  return {
    type,
    children: Object.entries(properties).map(([key, value]: any) => {
      return {
        name: key,
        ...value
      }
    })
  }
}

const parserProperties = (properties, required: string[] = []) => {
  return Object.entries(properties).map(([key, value]: any) => {
    const { items, $ref, ...other } = value
    const ref = items?.$ref || $ref
    return {
      name: key,
      required: required.includes(key),
      ...other,
      ...parserItems(ref)
    }
  })
}

const parserRequests = (requestBody) => {
  const content = requestBody?.content
  if (content == null) {
    return {
      requestBodyType: '',
      requestBody: []
    }
  }
  // * 仅取第一项
  const { schema }: any = Object.values(content).at(0)
  if (schema == null) {
    return {
      requestBodyType: '',
      requestBody: []
    }
  }
  if (schema['$ref']) {
    const { properties, required, type } = structMap.get(
      (schema['$ref'] as string).split('/').at(-1)
    )
    return {
      requestBodyType: bodyTypeHash.get(type) || 'json',
      requestBodyJsonType: type,
      requestBody: parserProperties(properties, required)
    }
  }
}

const toOpenapi = ({
  method,
  url,
  summary,
  operationId,
  parameters,
  responses,
  requestBody
  // description,
}) => {
  return {
    name: summary || operationId || url,
    protocol: 'http', // * openapi 中没有对应字段
    uri: url,
    projectID: 1,
    method: method.toUpperCase(),
    ...parserRequests(requestBody),
    ...parserParameters(parameters),
    ...parserResponses(responses['200'])
  }
}

export const importFunc = (openapi: openAPIType) => {
  if (Object.keys(openapi).length === 0) {
    return [null, { msg: '请上传合法的文件' }]
  }
  if (!openapi.openapi) {
    return [null, { msg: '文件不合法，缺乏 openapi 字段' }]
  }
  // * 先从 components 字段中读取出结构体
  // console.log('==>>', openapi)
  const { components, paths } = openapi
  if (components) {
    const { schemas } = components
    if (schemas) {
      Object.keys(schemas).forEach((it) => {
        structMap.set(it, schemas[it])
      })
    }
  }
  const apiData = Object.keys(paths)
    .map((url) => {
      const list: any = []
      Object.keys(paths[url]).forEach((method: string) => {
        list.push({
          method,
          url,
          ...paths[url][method]
        })
      })
      return list
    })
    .flat(Infinity)
    .map(toOpenapi)
  console.log(JSON.stringify(apiData.at(0), null, 2))
  const environment = []
  const group = []

  return [
    {
      environment,
      group,
      apiData
    },
    null
  ]
}
