import { transform } from '../shared/src/trans'

const source = [
  {
    name: 'aa',
    type: 'string',
    required: true,
    example: '',
    enum: [],
    description: 'AAA'
  },
  {
    name: 'bb',
    type: 'object',
    required: true,
    example: '',
    enum: [],
    description: 'BBB',
    children: [
      {
        name: 'bb-1',
        type: 'object',
        required: true,
        example: '',
        enum: [],
        description: '',
        children: [
          {
            name: 'bb-1-1',
            type: 'object',
            required: true,
            example: '',
            enum: [],
            description: '',
            children: [
              {
                name: 'bb-1-1-1',
                type: 'string',
                required: true,
                example: '',
                enum: [],
                description: ''
              }
            ]
          },
          {
            name: 'bb-1-2',
            type: 'string',
            required: true,
            example: '',
            enum: [],
            description: ''
          },
          {
            name: 'bb-1-3',
            type: 'object',
            required: true,
            example: '',
            enum: [],
            description: '',
            children: [
              {
                name: 'bb-1-3-1',
                type: 'string',
                required: true,
                example: '',
                enum: [],
                description: ''
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'cc',
    type: 'string',
    required: true,
    example: '',
    enum: [],
    description: ''
  }
]

test('trans', () => {
  const result = transform(source)
  console.log(JSON.stringify(result, null, 2))
  expect(result).toEqual({})
})
