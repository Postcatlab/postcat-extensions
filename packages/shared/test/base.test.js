import eoapi from './mocks/eoapi.json'
import { eo2openAPI } from '../src'

test('base eoapi to openapi', () => {
  const data = eo2openAPI(eoapi)
  expect(data).toEqual(2)
})
