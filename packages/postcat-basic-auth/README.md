# Basic Auth authentication plugin

Basic Auth is an HTTP-based security authentication mechanism that adds the `Authorization` field to the request header.

```HTTP
Client Request

GET /security/somethings HTTP/1.1
Authorization: Basic bmFtZTpwYXNzd29yZA==
```

## How to use

After installing the plug-in, select authentication on the test page, and after filling in the data, the header `Authorization` will be automatically added to the request information.
![](https://raw.githubusercontent.com/eolinker/postcat-extensions/main/packages/postcat-basic-auth/assets/images/2023-03-14-23-17-13.png)
