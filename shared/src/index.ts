import ToOpenApi from './toOpenAPI'

export const eo2openAPI = (element) => {
  const engine = new ToOpenApi(element)
  return engine
    .setPaths()
    .setTags()
    .setRequestHeader()
    .setRequestBody()
    .setResponseBody()
    .json()
}

export default {}
