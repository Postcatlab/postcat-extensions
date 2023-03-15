module.exports = {
  authAPI: (config) => {
    const headerValue = `Basic ${Buffer.from(
      `${config.username || ''}:${config.password}`
    ).toString('base64')}`
    return `pc.request.headers.add({
      key:'Authorization', value:'${headerValue}'
    })`
  }
}
