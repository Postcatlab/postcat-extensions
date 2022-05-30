import {
  setBase,
  setPaths,
  setTags,
  setRequestBody,
  setRequestHeader,
  setResponseBody
} from './utils'
import { eoAPIInterface } from '../types/eoAPI'

// const parseParamsInUrl = (url): string[] => {
//   return url.match(/(?<={)(\S)+?(?=})/g) || []
// }

// const setResponseHeader = (data, { apiData, uri, method }: sourceInterface) => {
//   _.set(data, [uri, method.toLowerCase()], responses)
//   return ''
// }

class ToOpenApi {
  data = {}
  sourceData
  constructor(data: eoAPIInterface) {
    this.sourceData = JSON.parse(JSON.stringify(data))
    const { project, version } = this.sourceData
    this.data = setBase({ ...project, version })
  }
  setPaths() {
    this.data = setPaths(this.data, this.sourceData)
    return this
  }
  setRequestBody() {
    this.data = setRequestBody(this.data, this.sourceData)
    return this
  }
  setRequestHeader() {
    this.data = setRequestHeader(this.data, this.sourceData)
    return this
  }
  //   setResponseHeader() {
  //     this.data = setResponseHeader(this.data, this.sourceData)
  //     return this
  //   }
  setResponseBody() {
    this.data = setResponseBody(this.data, this.sourceData)
    return this
  }

  setTags() {
    this.data = setTags(this.data, this.sourceData)
  }
  // setTagToApi() {
  //   this.data = setTagToApi(this.data, this.sourceData);
  // }
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

export default ToOpenApi
