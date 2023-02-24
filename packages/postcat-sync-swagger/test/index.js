const tools = require('../dist/index.js')
globalThis.pc = {
  getProjectSettings: () => {
    return {
      url: 'https://nest-api.buqiyuan.site/swagger-api-json'
    }
  },
  updateAPIData: (data) => {
    console.log('test success')
  }
}
tools.pullAPI()
