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

const parserItems = (data) => {
  return {}
}

const parserResponses = (data) => {
  if (!data) {
    console.log('Data is Empty')
    return {
      requestBodyType: '',
      requestBody: {}
    }
  }
  const { content } = data
  // * contentList => ['*/*', 'application/json', 'application/xml']
  const contentList = Object.keys(content)
  if (contentList.length === 0) {
    return {
      requestBodyType: '',
      requestBody: {}
    }
  }
  // * It could be better
  let dataSchema: any = null
  if (contentList.includes('application/json')) {
    dataSchema = content['application/json'].schema
  } else if (contentList.includes('application/xml')) {
    dataSchema = content['application/xml'].schema
  } else if (contentList.includes('*/*')) {
    dataSchema = content['*/*'].schema
  }
  const { items, type } = dataSchema
  return {
    requestBodyType: type,
    requestBody: {
      ...parserItems(items)
    }
  }
}

const toOpenapi = ({ method, url, summary, parameters, responses }) => {
  return {
    name: summary || url,
    protocol: 'http', // * openapi 中没有对应字段
    uri: url,
    projectID: 1,
    method: method.toUpperCase(),
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
  const structMap = new Map()
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
