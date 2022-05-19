### 推送

推送类插件允许我们将 Eoapi 上的数据一键推送到各个应用平台，比如：

- 推送到网关上完成 API 上线
- 和低代码平台结合，将 API 快速变成低代码平台中可使用的组件等。

#### 示例代码

一键将 API 推送到其他平台：[eoapi push eolink](https://github.com/eolinker/eoapi-extensions/tree/main/packages/feature/push/eolink)

#### 代码说明

- 导出方式：`Named Exports`（命名导出）
- 导出类型：`Function`
- 方法名：自定义，但需要配置中的` action` 字段保持一致
- 传入参数：Eoapi 的 API 对象
- 返回值：`null`
- 配置中的必要字段：
  - `action`：主函数名称
  - `label`：显示在 UI 上导出区域的名称

### 3. 功能预告

:::warning
以下插件功能将会在后续支持，敬请期待。
:::

- 导入插件
- API 文档生成代码
- 语言包
- 主题

你想要拓展的功能不在我们的计划上？请在 [Issue](https://github.com/eolinker/eoapi/issues) 提出你的需求，十分感谢。
