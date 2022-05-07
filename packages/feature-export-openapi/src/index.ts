import {
  setBase,
  setTags,
  // setTagToApi,
  setPaths,
  setRequest,
  setResponse
} from './utils'
class ToOpenApi {
  data: any = {}
  sourceData: any = {}
  constructor(data: any) {
    this.sourceData = JSON.parse(JSON.stringify(data))
    const { project } = this.sourceData
    this.data = setBase(project)
  }
  setPaths() {
    this.data = setPaths(this.data, this.sourceData)
    return this
  }
  setRequest() {
    this.data = setRequest(this.data, this.sourceData)
    return this
  }
  setResponse() {
    this.data = setResponse(this.data, this.sourceData)
    return this
  }
  setTags() {
    this.data = setTags(this.data, this.sourceData)
  }
  // setTagToApi() {
  //   this.data = setTagToApi(this.data, this.sourceData);
  // }
  setComponents() {
    return this
  }
  log(indent = 2) {
    console.log(JSON.stringify(this.data, null, indent))
    return this
  }
  json() {
    return this.data
  }
  yaml() {
    return ''
  }
}

export const export_convert = (element: any) => {
  const engine = new ToOpenApi(element)
  const json = engine.setPaths().setRequest().setResponse().log().json()
  return json
}
