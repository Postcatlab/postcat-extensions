export interface openAPIInterface {
  openapi: string
  info: {
    title: string
    description: string
    termsOfService: string
    contact: object
    license: {
      name: string
      url: string
    }
    version: string
  }
  externalDocs: {
    description: string
    url: string
  }
  servers: []
  paths: {}
  tags: []
  components: []
}
