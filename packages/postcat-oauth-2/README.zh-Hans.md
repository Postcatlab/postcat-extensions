# OAuth 2.0 鉴权插件

OAuth 2.0 是目前最流行的授权机制，用来授权第三方应用，获取用户数据。

## 使用方式

安装插件后，测试页面选中鉴权，填入数据后会自动在请求信息中添加头部 `Authorization`。
![](https://raw.githubusercontent.com/eolinker/postcat-extensions/main/packages/postcat-jwt/assets/images/2023-03-15-10-42-12.png)

## JWT 说明

OAuth 2.0 规定了四种获得令牌的流程。你可以选择最适合自己的那一种，向第三方应用颁发令牌。下面就是这四种授权方式。

- 授权码（authorization-code）
- 隐藏式（implicit）
- 密码式（password）：
- 客户端凭证（client credentials）

![](../assets/images/2023-04-10-14-49-55.png)

> 引用自：https://www.ruanyifeng.com/blog/2019/04/oauth-grant-types.html
