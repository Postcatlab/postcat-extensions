const OAuth = require('oauth')
var OAuth2 = OAuth.OAuth2
var twitterConsumerKey = '9c7cfcd303eb07cca8541ba59e916f3eFHxoKHnCoUF'
var twitterConsumerSecret = 'sRQn6ZzLnLA2B4alF9VzFwJb74ZwOYZc3AcvWagcDn'
var oauth2 = new OAuth2(
  twitterConsumerKey,
  twitterConsumerSecret,
  'https://api.twitter.com/',
  null,
  'oauth2/token',
  null
)
oauth2.getOAuthAccessToken(
  '',
  { grant_type: 'client_credentials' },
  function (e, access_token, refresh_token, results) {
    console.log(e)
    console.log('bearer: ', access_token)
  }
)

// module.exports = {
//   authAPI: (config) => {
//     try {
//       const authorizationValue = `Bearer ${jwt.sign(
//         JSON.parse(config.payload),
//         config.isBase64Encoded
//           ? Buffer.from(config.Secret).toString('base64')
//           : config.Secret,
//         { algorithm: config.Algorithm }
//       )}`

//       return `pc.request.headers.add({
//         key:'Authorization', value:'${authorizationValue}'
//       })`
//     } catch (err) {
//       console.error(err)
//       return null
//     }
//   }
// }
