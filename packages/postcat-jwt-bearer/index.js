module.exports = {
  authAPI: (config) => {
    console.log(config, 222);

    // const headerValue = `Basic ${Buffer.from(config.username || '')}:${
    //   config.password
    // }`
    return `pc.request.query.add({
      key:'Authorization', value:'123'
    })`
  }
}
