const {
  export_convert
} = require('../packages/feature/export/openapi/dist/index.js')

const result = export_convert({
  data: {
    environment: [
      {
        projectID: 1,
        hostUri: 'AAAAA是',
        name: '实现上',
        parameters: [],
        uuid: 1,
        updatedAt: '2022-05-30T01:37:25.559Z'
      },
      { projectID: 1, hostUri: 'BBBBB', name: 'BBB', parameters: [], uuid: 2 },
      { projectID: 1, hostUri: 'CCCCCC', name: 'CCC', parameters: [], uuid: 3 }
    ],
    group: [],
    project: { uuid: 1, name: 'Default' },
    apiData: [
      {
        name: 'happy',
        projectID: 1,
        uri: '/oop',
        groupID: 0,
        protocol: 'http',
        method: 'POST',
        requestBodyType: 'json',
        requestBodyJsonType: 'object',
        requestBody: [
          {
            name: 'aaa',
            type: 'object',
            required: true,
            example: '',
            enum: [],
            description: 'AAA',
            children: [
              {
                name: 'aaa-1',
                type: 'object',
                required: true,
                example: '',
                enum: [],
                description: 'AAA-1',
                children: [
                  {
                    name: 'aaa-1-1',
                    type: 'object',
                    required: true,
                    example: '',
                    enum: [],
                    description: 'AAA-1-1',
                    children: [
                      {
                        name: 'aaa-1-1-1',
                        type: 'string',
                        required: true,
                        example: '',
                        enum: [],
                        description: 'AAA-1-1-1'
                      }
                    ]
                  },
                  {
                    name: 'aaa-1-2',
                    type: 'string',
                    required: true,
                    example: '',
                    enum: [],
                    description: 'AAA-1-2'
                  },
                  {
                    name: 'aaa-1-3',
                    type: 'number',
                    required: true,
                    example: '',
                    enum: [],
                    description: 'AAA-1-3'
                  }
                ]
              },
              {
                name: 'aaa-2',
                type: 'string',
                required: true,
                example: '',
                enum: [],
                description: 'aaa-2'
              }
            ]
          },
          {
            name: 'bbb',
            type: 'string',
            required: true,
            example: '',
            enum: [],
            description: 'BBB'
          }
        ],
        queryParams: [],
        restParams: [],
        requestHeaders: [],
        responseHeaders: [],
        responseBodyType: 'json',
        responseBodyJsonType: 'object',
        responseBody: [],
        createdAt: '2022-05-23T10:53:41.010Z',
        updatedAt: '2022-05-23T10:53:41.010Z',
        uuid: 54
      }
    ],
    version: '1.0.2'
  }
})

console.log(JSON.stringify(result, null, 2))
