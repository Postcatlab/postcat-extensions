# Basic Auth 鉴权插件

Basic Auth 是基于 HTTP 的安全认证机制，会在请求头部加入 Authorization 字段。

```HTTP
Client Request

GET /security/somethings  HTTP/1.1
Authorization: Basic bmFtZTpwYXNzd29yZA==
```

## 使用方式

安装插件后，测试页面选中鉴权
![](https://raw.githubusercontent.com/eolinker/postcat-extensions/main/packages/postcat-basic-auth/assets/images/2023-03-14-23-17-13.png)
