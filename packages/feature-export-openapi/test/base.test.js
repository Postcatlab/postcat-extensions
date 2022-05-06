import eoapi from '../mocks/eoapi.json'
import { export_convert } from '../dist/index.js'

test('base', () => {
  const data = export_convert(eoapi)
  expect(data).toEqual(openAPI)
})
