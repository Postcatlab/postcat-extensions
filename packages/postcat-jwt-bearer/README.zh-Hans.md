# JWT 鉴权插件

JSON Web Token (JWT) 是为在网络应用环境间传递声明而执行的一种基于 JSON 的开放标准，安装后会在请求头部 Authorization 加入 JWT 鉴权后的值。

JWT 被设计为紧凑且安全，特别适用于分布式站点的单点登录（SSO）场景。JWT 一般被用来在身份提供者和服务提供者间传递被认证的用户身份信息，以便于从资源服务器获取资源，也可以增加一些额外的其它业务逻辑所必须的声明信息。

## 使用方式

安装插件后，测试页面选中鉴权，填入数据后会自动在请求信息中添加头部 `Authorization`。
![](https://raw.githubusercontent.com/eolinker/postcat-extensions/main/packages/postcat-jwt/assets/images/2023-03-15-10-42-12.png)

## JWT 说明

```HTTP
Client Request

GET /security/somethings  HTTP/1.1
Authorization: Basic bmFtZTpwYXNzd29yZA==
```

包括:

**头部**

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

WT 规定了 7 个默认字段供开发者选用。

- iss (issuer)：签发人
- exp (expiration time)：过期时间
- sub (subject)：主题
- aud (audience)：受众，相当于接受者
- nbf (Not Before)：生效的起始时间
- iat (Issued At)：签发时间
- jti (JWT ID)：编号，唯一标识

**签名 Signature**

对于每种加密算法，签名都对应的一个计算公式。例如 SHA256 加密算法的签名如下：

```
HMACSHA256(
base64UrlEncode(header) + "." +
base64UrlEncode(payload) + "." +
Secret
)
```
