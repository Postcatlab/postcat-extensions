import ToOpenApi from './toOpenAPI'

export const eo2openAPI = (element) => {
  const engine = new ToOpenApi(element)
  return engine
    .setPaths()
    .setRequestHeader()
    .setRequestBody()
    .setResponseBody()
    .log()
    .json()
}

export default {}
