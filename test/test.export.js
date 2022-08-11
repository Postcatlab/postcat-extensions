const {
  export_convert
} = require('../packages/feature/export/openapi/dist/index.js')

const json = require('./mocks/eoapi2.json')

const result = export_convert({ data: json })

console.log(JSON.stringify(result, null, 2))
