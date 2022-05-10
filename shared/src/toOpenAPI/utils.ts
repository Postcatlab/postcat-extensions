import { set, get } from 'lodash-unified'
import { eoAPIInterface } from '../types/eoAPI'

const paramTypeHash = new Map()
  .set('json', 'application/json')
  .set('xml', 'application/xml')
  .set('formData', 'multipart/form-data')

const typeHash = new Map().set('json', 'object')

const jsonTypeHash = new Map().set('array', 'array')

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
  set(
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
    set(data, ['paths', uri, method.toLowerCase()], {
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
      get(data, ['paths', uri, method.toLowerCase(), 'parameters']) || []
    set(
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
    if (requestBodyType === 'json') {
      set(
        data,
        ['paths', uri, method.toLowerCase(), 'requestBody', 'required'],
        true
      )
    }
    requestBody.forEach(({ name, description, required, type, example }) => {
      set(
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

export const setResponseBody = (data, { apiData }: eoAPIInterface) => {
  apiData.forEach(
    ({ responseBodyType, uri, method, responseBody, responseBodyJsonType }) => {
      const paramType = paramTypeHash.get(responseBodyType)
      const jsonType = jsonTypeHash.get(responseBodyJsonType)
      set(
        data,
        ['paths', uri, method.toLowerCase(), 'responses', '200', 'description'],
        'OK'
      )
      responseBody.forEach(({ name, ...it }) => {
        set(
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
      if (jsonType === 'array') {
        set(
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
          { type: 'array', items: {} }
        )
      } else {
        set(
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
          typeHash.get(responseBodyType)
        )
      }
    }
  )

  return data
}
