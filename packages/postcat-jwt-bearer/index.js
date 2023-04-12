const jwt = require('jsonwebtoken');
const { createPrivateKey } = require('crypto');

module.exports = {
  authAPI: (config) => {
    try {
      const HsArr = ['HS256', 'HS384', 'HS512']

      const key = HsArr.includes(config.algorithm) ?
        (config.isBase64Encoded ? Buffer.from(config.Secret).toString('base64') : config.Secret) :
        createPrivateKey(config.Secret)


      const authorizationValue = jwt.sign(
        config.payload ? JSON.parse(config.payload) : {},
        key,
        {algorithm: config.algorithm, header: config.jwtHeaders ? JSON.parse(config.jwtHeaders) : {}}
      )

      if(config.tokenPosition === 'header') {
        return `pc.request.headers.add({
          key:'Authorization', value:'${config.headerPrefix || 'Bearer'} ${authorizationValue}'
        })`
      } else {
        return `pc.request.addQueryParams({
          key: '${config.queryTokenName || 'token'}', value: '${authorizationValue}'
        })`
      }
    } catch (err) {
      console.error(err)

      return null
    }
  }
}
