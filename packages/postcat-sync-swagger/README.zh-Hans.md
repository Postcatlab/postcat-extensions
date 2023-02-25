# 同步 Swagger URL 插件

支持从 Swagger URL 增量同步 API 数据到 Postcat。

## 使用

进入 API 模块，鼠标移动到主按钮加号，下拉看到从 Swagger 同步 URL 的选项。
![](https://raw.githubusercontent.com/eolinker/postcat-extensions/main/packages/postcat-sync-swagger/assets/images/2023-02-25-11-18-47.png)

填写完配置点击立即同步即可同步 API 数据。
![](https://raw.githubusercontent.com/eolinker/postcat-extensions/main/packages/postcat-sync-swagger/assets/images/2023-02-25-18-10-36.png)

## 同步规则

新的数据覆盖旧的数据

- API Path 和请求方式相同视为同一 API
- 同名同层级的分组视为同一分组
