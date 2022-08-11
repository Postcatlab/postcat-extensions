import * as _ from 'lodash'
import { eoAPIInterface } from '../types/eoAPI'

const paramTypeHash = new Map()
  .set('json', 'application/json')
  .set('xml', 'application/xml')
  .set('formData', 'multipart/form-data')

// const typeHash = new Map().set('json', 'object')

const transformProperties = (data, type) => {
  if (_.isEmpty(data)) {
    return {}
  }
  return {
    type,
    required: [
      ...new Set(data?.filter((it) => it.required).map((it) => it.name) || [])
    ],
    properties: data.reduce(
      (total, { type, required, name, children, ...item }) => ({
        ...total,
        [name]: {
          ...item,
          items: children?.length ? transformProperties(children, type) : {}
        }
      }),
      {}
    )
  }
}

export const setBase = ({ name, version }) => ({
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

export const setTags = (data, sourceData: eoAPIInterface) => {
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

export const setPaths = (data, { apiData }: eoAPIInterface) => {
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

export const setRequestHeader = (data, { apiData }: eoAPIInterface) => {
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

export const setRequestBody = (data, { apiData }: eoAPIInterface) => {
  apiData.forEach(({ requestBodyType, uri, method, requestBody }) => {
    const paramType = paramTypeHash.get(requestBodyType)
    if (!paramType) {
      console.error(`Can't parser the params type`)
      return
    }
    if (requestBodyType === 'json' && requestBody?.length > 0) {
      _.set(
        data,
        ['paths', uri, method.toLowerCase(), 'requestBody', 'required'],
        true
      )
    }
    _.set(
      data,
      [
        'paths',
        uri,
        method.toLowerCase(),
        'requestBody',
        'content',
        paramType,
        'schema'
      ],
      transformProperties(requestBody, requestBodyType)
    )
  })
  return data
}

export const setResponseBody = (data, { apiData }: eoAPIInterface) => {
  apiData.forEach(
    ({ responseBodyType, uri, method, responseBody, responseBodyJsonType }) => {
      const paramType = paramTypeHash.get(responseBodyType)
      _.set(
        data,
        ['paths', uri, method.toLowerCase(), 'responses', '200', 'description'],
        'OK'
      )
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
          'schema'
        ],
        transformProperties(responseBody, responseBodyJsonType)
      )
    }
  )
  return data
}
