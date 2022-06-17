export const importFunc = (data) => {
  return {
    version: '1.0.3',
    environment: [],
    group: [],
    apiData: [
      {
        name: '自定义导入数据2',
        projectID: 1,
        uri: 'http://www.weather.com.cn/data/cityinfo/{cityCode}.html',
        groupID: 0,
        protocol: 'http',
        method: 'GET',
        requestBodyType: 'raw',
        requestBodyJsonType: 'object',
        requestBody: '',
        queryParams: [],
        restParams: [
          {
            name: 'cityCode',
            required: true,
            example: '101010100',
            description:
              '城市代码 : http://www.mca.gov.cn/article/sj/xzqh/2020/20201201.html',
            enum: [
              {
                default: true,
                value: '110000',
                description: 'Beijing'
              },
              {
                default: false,
                value: '440000',
                description: 'Guangdong'
              },
              {
                default: false,
                value: '',
                description: ''
              }
            ]
          }
        ],
        requestHeaders: [],
        responseHeaders: [],
        responseBodyType: 'json',
        responseBodyJsonType: 'object',
        responseBody: [
          {
            name: 'weatherinfo',
            required: true,
            example: '',
            type: 'object',
            description: '',
            children: [
              {
                name: 'city',
                description: '',
                type: 'string',
                required: true,
                example: '北京'
              }
            ]
          }
        ],
        weight: 0,
        uuid: 1
      },
      {
        name: '自定义导入数据3',
        projectID: 1,
        uri: 'http://www.weather.com.cn/data/cityinfo/{cityCode}.html',
        groupID: 0,
        protocol: 'http',
        method: 'GET',
        requestBodyType: 'raw',
        requestBodyJsonType: 'object',
        requestBody: '',
        queryParams: [],
        restParams: [
          {
            name: 'cityCode',
            required: true,
            example: '101010100',
            description:
              '城市代码 : http://www.mca.gov.cn/article/sj/xzqh/2020/20201201.html',
            enum: [
              {
                default: true,
                value: '110000',
                description: 'Beijing'
              },
              {
                default: false,
                value: '440000',
                description: 'Guangdong'
              },
              {
                default: false,
                value: '',
                description: ''
              }
            ]
          }
        ],
        requestHeaders: [],
        responseHeaders: [],
        responseBodyType: 'json',
        responseBodyJsonType: 'object',
        responseBody: [
          {
            name: 'weatherinfo',
            required: true,
            example: '',
            type: 'object',
            description: '',
            children: [
              {
                name: 'city',
                description: '',
                type: 'string',
                required: true,
                example: '北京'
              }
            ]
          }
        ],
        weight: 0,
        uuid: 1
      }
    ]
  }
}
