import { eo2openAPI } from '../shared'

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

// const source2 = {
//   environment: [],
//   group: [],
//   project: [
//     {
//       uuid: 1,
//       name: 'Default'
//     }
//   ],
//   apiData: [
//     {
//       name: 'post-form',
//       projectID: 1,
//       uri: '/llp',
//       groupID: 0,
//       protocol: 'http',
//       method: 'POST',
//       requestBodyType: 'formData',
//       requestBodyJsonType: 'object',
//       requestBody: [
//         {
//           listDepth: 0,
//           name: 'AA',
//           type: 'string',
//           required: true,
//           example: '',
//           enum: [],
//           description: 'AAAA'
//         },
//         {
//           listDepth: 0,
//           name: '看看',
//           type: 'string',
//           required: true,
//           example: '',
//           enum: [],
//           description: ''
//         }
//       ],
//       queryParams: [],
//       restParams: [],
//       requestHeaders: [],
//       responseHeaders: [],
//       responseBodyType: 'json',
//       responseBodyJsonType: 'array',
//       responseBody: [
//         {
//           name: 'sss',
//           type: 'string',
//           required: true,
//           example: '',
//           enum: [],
//           description: 'SSS'
//         }
//       ],
//       uuid: 5
//     }
//   ],
//   version: '0.0.3-beta'
// }

// const target2 = {
//   components: [],
//   externalDocs: {
//     description: 'Find out more about Swagger',
//     url: 'http://swagger.io'
//   },
//   info: {
//     contact: {},
//     description: 'Default',
//     license: {
//       name: 'Apache 2.0',
//       url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
//     },
//     termsOfService: '',
//     title: 'Default',
//     version: '0.0.3-beta'
//   },
//   openapi: '3.0.1',
//   paths: {
//     '/llp': {
//       post: {
//         parameters: [],
//         requestBody: {
//           content: {
//             'multipart/form-data': {
//               schema: {
//                 properties: {
//                   AA: {
//                     description: 'AAAA',
//                     example: '',
//                     required: true,
//                     type: 'string'
//                   },
//                   看看: {
//                     description: '',
//                     example: '',
//                     required: true,
//                     type: 'string'
//                   }
//                 }
//               }
//             }
//           }
//         },
//         responses: {
//           '200': {
//             content: {
//               'application/json': {
//                 schema: {
//                   properties: {
//                     sss: {
//                       description: 'SSS',
//                       enum: [],
//                       example: '',
//                       required: true,
//                       type: 'string'
//                     }
//                   },
//                   type: 'object'
//                 }
//               }
//             },
//             description: 'OK'
//           }
//         },
//         security: [],
//         tags: []
//       }
//     }
//   },
//   servers: [],
//   tags: []
// }

// const source3 = {}

// const target3 = {}

test('Test 1: rq-json/post/rs-json', () => {
  const result = eo2openAPI(source)
  // console.log(JSON.stringify(eoapi, null, 2))
  expect(result).toEqual(target)
})

// test('Test 2: rq-form/post/rs-array', () => {
//   const result = eo2openAPI(source2)
//   expect(result).toEqual(target2)
// })

// test('Test 3: rq-rest/get/rs-array', () => {
//   const result = eo2openAPI(source2)
//   expect(result).toEqual(target2)
// })
