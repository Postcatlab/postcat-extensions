# JWT authentication plugin

Json Web Token (JWT) is an open JSON-based standard implemented for passing claims between web application environments.

JWT is designed to be compact and secure, especially suitable for single sign-on (SSO) scenarios of distributed sites. JWT is generally used to transfer authenticated user identity information between identity providers and service providers, so as to obtain resources from resource servers, and can also add some additional statement information necessary for other business logic.

## How to use

After installing the plug-in, select authentication on the test page, and after filling in the data, the header `Authorization` will be automatically added to the request information.
![](https://raw.githubusercontent.com/eolinker/postcat-extensions/main/packages/postcat-jwt/assets/images/2023-03-15-10-42-12.png)

## JWT description

```HTTP
Client Request

GET /security/somethings HTTP/1.1
Authorization: Basic bmFtZTpwYXNzd29yZA==
```

including:

**head**

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload**

```json
{
  "name": "Postcat",
  "introduce": "An extensible API tool."
}
```

WT provides 7 default fields for developers to choose.

- iss (issuer): issuer
- exp (expiration time): expiration time
- sub (subject): subject
- aud (audience): Audience, equivalent to the recipient
- nbf (Not Before): the start time to take effect
- iat (Issued At): Issue time
- jti (JWT ID): number, unique identifier

**Signature**

For each encryption algorithm, the signature corresponds to a calculation formula. For example, the signature of the SHA256 encryption algorithm is as follows:

```
HMACSHA256(
base64UrlEncode(header) + "." +
base64UrlEncode(payload) + "." +
Secret
)
```
