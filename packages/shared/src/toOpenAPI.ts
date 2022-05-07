import * as _ from 'lodash'

// const parseParamsInUrl = (url): string[] => {
//   return url.match(/(?<={)(\S)+?(?=})/g) || []
// }

interface sourceInterface {
  environment: string
  group: Array<{ name: string }>
  project: Array<{ name: string }>
  apiData: Array<{
    name: string
    uri: string
    method: string
    requestBodyType: string
    responseBodyType: string
    responseBody: Array<{
      name: string
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

const paramTypeHash = new Map()
  .set('json', 'application/json')
  .set('xml', 'application/xml')
  .set('form', 'multipart/form-data')

const setBase = ({ name, version }) => ({
  openapi: '3.0.1',
  info: {
    title: name || '',
    description: name || '',
    termsOfService: '',
    contact: {},
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
    },
    version: version || '1.0.0'
  },
  externalDocs: {
    description: 'Find out more about Swagger',
    url: 'http://swagger.io'
  },
  servers: [],
  paths: {},
  tags: [],
  components: []
})

const setTags = (data, sourceData: sourceInterface) => {
  const { group } = sourceData
  _.set(
    data,
    ['tags'],
    group.map(({ name }) => ({
      name,
      description: name,
      externalDocs: {}
    }))
  )
  return data
}

const setPaths = (data, { apiData }: sourceInterface) => {
  apiData.forEach(({ uri, method }) => {
    _.set(data, ['paths', uri, method.toLowerCase()], {
      tags: [],
      requestBody: {
        content: {}
      },
      responses: {},
      security: []
    })
  })
  return data
}

const setRequestHeader = (data, { apiData }: sourceInterface) => {
  apiData.forEach(({ requestHeaders, method, uri }) => {
    const headerList = requestHeaders.map(({ name, ...it }) => ({
      name,
      in: 'header',
      schema: { ...it, type: 'string' }
    }))
    const parameters =
      _.get(data, ['paths', uri, method.toLowerCase(), 'parameters']) || []
    _.set(
      data,
      ['paths', uri, method.toLowerCase(), 'parameters'],
      parameters.concat(headerList)
    )
  })
  return data
}

const setRequestBody = (data, { apiData }: sourceInterface) => {
  apiData.forEach(({ requestBodyType, uri, method, requestBody }) => {
    const paramType = paramTypeHash.get(requestBodyType)
    if (!paramType) {
      console.error(`Can't parser the params type`)
      return
    }
    if (requestBodyType === 'json') {
      _.set(
        data,
        ['paths', uri, method.toLowerCase(), 'requestBody', 'required'],
        true
      )
    }
    requestBody.forEach(({ name, description, required, type, example }) => {
      _.set(
        data,
        [
          'paths',
          uri,
          method.toLowerCase(),
          'requestBody',
          'content',
          paramType,
          'schema',
          'properties',
          name
        ],
        {
          description,
          required,
          type,
          example
        }
      )
    })
  })
  return data
}

const setResponseBody = (data, { apiData }: sourceInterface) => {
  apiData.forEach(({ responseBodyType, uri, method, responseBody }) => {
    const paramType = paramTypeHash.get(responseBodyType)
    _.set(
      data,
      ['paths', uri, method.toLowerCase(), 'responses', '200', 'description'],
      'OK'
    )
    responseBody.forEach(({ name, ...it }) => {
      _.set(
        data,
        [
          'paths',
          uri,
          method.toLowerCase(),
          'responses',
          '200',
          'content',
          paramType,
          'schema',
          'properties',
          name
        ],
        it
      )
    })
    _.set(
      data,
      [
        'paths',
        uri,
        method.toLowerCase(),
        'responses',
        '200',
        'content',
        paramType,
        'schema',
        'type'
      ],
      responseBodyType
    )
  })

  return data
}

// const setResponseHeader = (data, { apiData, uri, method }: sourceInterface) => {
//   _.set(data, [uri, method.toLowerCase()], responses)
//   return ''
// }

class ToOpenApi {
  data = {}
  sourceData
  constructor(data: sourceInterface) {
    this.sourceData = JSON.parse(JSON.stringify(data))
    const { project, version } = this.sourceData
    this.data = setBase({ ...project[0], version })
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
