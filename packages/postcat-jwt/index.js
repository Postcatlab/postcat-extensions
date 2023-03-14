module.exports = {
  authAPI: (config) => {
    const headerValue = `Basic ${Buffer.from(config.username || '')}:${
      config.password
    }`
    return `pc.request.query.add({
      key:'Authorization', value:'${headerValue}'
    })`
  }
}
