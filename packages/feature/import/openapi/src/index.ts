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

// const parserOpenAPI = (data) => {}

// const updataAll = (data, eoapi) => {}

// const updataAdd = (data, eoapi) => {}

// const updataImport = (data, eoapi) => {}

// const updateNew = (data, eoapi) => {}

export const importFunc = (eoapi: any, openapi: openAPIType, type = 'add') => {
  // const updateStrategy = (eoapi) => {
  //   const data = parserOpenAPI(openapi)
  //   return (eoapi) => ({
  //     all: updataAll(data, eoapi),
  //     add: updataAdd(data, eoapi),
  //     import: updataImport(data, eoapi),
  //     new: updateNew(data, eoapi)
  //   })
  // }
  // * 先从 components 字段中读取出结构体
  const {
    components: { schemas },
    paths
  } = openapi
  const structMap = new Map()
  Object.keys(schemas).forEach((it) => {
    structMap.set(it, schemas[it])
  })
  console.log(paths)
  // const apiData = Object.keys(paths)
  //   .map((url) => {
  //     const list: any = []
  //     Object.keys(paths[url]).forEach((method: string) => {
  //       list.push({ method, url, ...paths[url][method] })
  //     })
  //     return list
  //   })
  //   .flat(Infinity)
  const environment = []
  const group = []

  // updateStrategy[type]()
  return {
    version: '1.0.3',
    environment,
    group,
    apiData: [
      {
        name: '自定义导入数据3',
        projectID: 1,
        uri: 'http://www.weather.com.cn/data/cityinfo/{cityCode}.html',
        groupID: 0,
        protocol: 'http',
        method: 'GET',
        requestBodyType: 'raw',
        requestBodyJsonType: 'object',
        requestBody: '',
        queryParams: [],
        restParams: [
          {
            name: 'cityCode',
            required: true,
            example: '101010100',
            description:
              '城市代码 : http://www.mca.gov.cn/article/sj/xzqh/2020/20201201.html',
            enum: [
              {
                default: true,
                value: '110000',
                description: 'Beijing'
              },
              {
                default: false,
                value: '440000',
                description: 'Guangdong'
              },
              {
                default: false,
                value: '',
                description: ''
              }
            ]
          }
        ],
        requestHeaders: [],
        responseHeaders: [],
        responseBodyType: 'json',
        responseBodyJsonType: 'object',
        responseBody: [
          {
            name: 'weatherinfo',
            required: true,
            example: '',
            type: 'object',
            description: '',
            children: [
              {
                name: 'city',
                description: '',
                type: 'string',
                required: true,
                example: '北京'
              }
            ]
          }
        ],
        weight: 0,
        uuid: 1
      }
    ]
  }
}
