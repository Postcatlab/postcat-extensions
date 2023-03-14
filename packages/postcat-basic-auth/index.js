module.exports = {
  authAPI: (config) => {
    return `pc.request.headers.add({
      key:'Authorization1', value:'Basic ${config.username}:${config.password}'
    })`
  }
}
