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
    }
  }
  components: {
    schemas: {}
    securitySchemes?: {}
  }
}
export const importFunc = (eoapi: any, openapi: openAPIType, type = 'add') => {
  // * 先从 components 字段中读取出结构体
  const { components } = openapi
  console.log(JSON.stringify(components, null, 2))
  return {
    name: 'eoapi-import'
  }
}
