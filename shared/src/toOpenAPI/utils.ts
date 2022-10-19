import _ from 'lodash-es'
import { eoAPIType } from '../types/eoAPI'
import { OpenAPIV3 } from 'openapi-types'

export const paramTypeHash = new Map()
  .set('json', 'application/json')
  .set('xml', 'application/xml')
  .set('formData', 'multipart/form-data')
  .set('raw', 'text/plain')

const typeHash = new Map().set('json', 'object')

const transformProperties = (data, type) => {
  if (_.isEmpty(data) || !Array.isArray(data)) {
    return {
      type: 'string',
      example: data
    }
  }
  return {
    type: typeHash.get(type) || type,
    required: [
      ...new Set(data?.filter((it) => it.required).map((it) => it.name) || [])
    ],
    properties: data.reduce(
      (total, { type, required, enum: struct, name, children, ...item }) => ({
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

export const parseDoc = ({ name, version }): OpenAPIV3.Document => ({
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
  components: {}
})

export const parseTags = (data, sourceData: eoAPIType): OpenAPIV3.TagObject => {
  const { group } = sourceData

  _.set(
    data,
    ['tags'],
    group.map(({ name }) => ({
      name,
      description: name
    }))
  )
  return data
}

export const setPaths = (data, { apiData, group }: eoAPIType) => {
  apiData.forEach(({ uri, name, method, groupID }) => {
    const groupName = group.find((n) => n.uuid === groupID)?.name
    _.set(data, ['paths', uri, method.toLowerCase()], {
      tags: groupName ? [groupName] : [],
      summary: name,
      description: name,
      operationId: name,
      requestBody: ['DELETE', 'GET'].includes(method)
        ? undefined
        : {
            content: {}
          },
      responses: {},
      security: []
    })
  })
  return data
}

export const setRequestHeader = (data, { apiData }: eoAPIType) => {
  apiData.forEach(({ requestHeaders, method, uri }) => {
    const headerList = requestHeaders.map(({ name, required, ...it }) => ({
      name,
      in: 'header',
      required: true,
      schema: { ...it, type: 'string' }
    }))
    const pathParams =
      uri.match(/(?<=\{)(.+?)(?=\})/g)?.map((n) => ({
        name: n,
        in: 'path',
        description: '',
        required: true,
        example: '',
        schema: {
          type: 'string'
        }
      })) || []
    const parameters =
      _.get(data, ['paths', uri, method.toLowerCase(), 'parameters']) || []
    _.set(
      data,
      ['paths', uri, method.toLowerCase(), 'parameters'],
      parameters.concat(headerList).concat(pathParams)
    )
  })
  return data
}

export const setRequestBody = (data, { apiData }: eoAPIType) => {
  apiData.forEach(({ requestBodyType, uri, method, requestBody }) => {
    const paramType = paramTypeHash.get(requestBodyType)
    if (['DELETE', 'GET'].includes(method)) {
      return
    }
    if (!paramType) {
      console.log('paramType', paramType, requestBodyType)
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

export const setResponseBody = (data, { apiData }: eoAPIType) => {
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
