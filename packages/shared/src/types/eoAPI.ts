export interface eoAPIInterface {
  environment: string
  group: Array<{ name: string }>
  project: Array<{ name: string }>
  apiData: Array<{
    name: string
    uri: string
    method: string
    requestBodyType: string
    responseBodyType: string
    responseBodyJsonType: string
    responseBody: Array<{
      name: string
      type: string
      required: boolean
      example: string
      enum: Array<object>
      description: string
    }>
    requestHeaders: Array<{
      name: string
      required: boolean
      example: string
      description: string
    }>
    requestBody: Array<{
      name: string
      type: string
      required: boolean
      example: string | number
      description: string
      enum: Array<object>
    }>
  }>
}
