import { eo2openAPI } from '../src'
import * as _ from 'lodash'

const source = {
  environment: [],
  group: [],
  project: [
    {
      uuid: 1,
      name: 'Default'
    }
  ],
  apiData: [
    {
      name: 'test',
      projectID: 1,
      uri: '/oop',
      groupID: 0,
      protocol: 'http',
      method: 'POST',
      requestBodyType: 'json',
      requestBodyJsonType: 'object',
      requestBody: [
        {
          name: 'bbb',
          type: 'string',
          required: true,
          example: '',
          enum: [],
          description: 'BBB'
        },
        {
          name: 'ccc',
          type: 'number',
          required: true,
          example: '',
          enum: [],
          description: '123456'
        }
      ],
      queryParams: [],
      restParams: [],
      requestHeaders: [
        {
          name: 'haa',
          required: true,
          example: 'haaE',
          description: 'haaD'
        },
        {
          name: 'hbb',
          required: true,
          example: 'hbbE',
          description: 'hbbD'
        }
      ],
      responseBodyType: 'json',
      responseBodyJsonType: 'object',
      responseBody: [
        {
          name: 'raa',
          type: 'string',
          required: true,
          example: '',
          enum: [],
          description: 'RAA'
        }
      ],
      uuid: 3,
      updatedAt: '2022-04-28T09:05:25.739Z'
    }
  ],
  version: '0.0.3-beta'
}

const target = {
  components: [],
  externalDocs: {
    description: 'Find out more about Swagger',
    url: 'http://swagger.io'
  },
  info: {
    contact: {},
    description: 'Default',
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
    },
    termsOfService: '',
    title: 'Default',
    version: '0.0.3-beta'
  },
  openapi: '3.0.1',
  paths: {
    '/oop': {
      post: {
        parameters: [
          {
            name: 'haa',
            in: 'header',
            schema: {
              required: true,
              example: 'haaE',
              description: 'haaD',
              type: 'string'
            }
          },
          {
            name: 'hbb',
            in: 'header',
            schema: {
              required: true,
              example: 'hbbE',
              description: 'hbbD',
              type: 'string'
            }
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  bbb: {
                    type: 'string',
                    example: '',
                    required: true,
                    description: 'BBB'
                  },
                  ccc: {
                    type: 'number',
                    example: '',
                    required: true,
                    description: '123456'
                  }
                }
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    raa: {
                      type: 'string',
                      required: true,
                      example: '',
                      enum: [],
                      description: 'RAA'
                    }
                  }
                }
              }
            }
            // headers: {
            //   'X-Rate-Limit': {
            //     description: 'calls per hour allowed by the user',
            //     schema: {
            //       type: 'integer',
            //       format: 'int32'
            //     }
            //   }
            // },
          }
        },
        security: [],
        tags: []
      }
    }
  },
  servers: [],
  tags: []
}

test('simple openAPI', () => {
  const result = eo2openAPI(source)
  // console.log(JSON.stringify(eoapi, null, 2))
  expect(result).toEqual(target)
})
