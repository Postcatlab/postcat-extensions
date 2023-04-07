const jwt = require('jsonwebtoken');

module.exports = {
  authAPI: (config) => {

    try {
      const authorizationValue = `Bearer ${jwt.sign(
        JSON.parse(config.payload),
        config.Secret,
        {algorithm: config.Algorithm}
      )}`

      return `pc.request.headers.add({
        key:'Authorization', value:'${authorizationValue}'
      })`
    } catch (err) {
      console.error(err)
    }
  }
}
