### 导出

可以使用导出类插件定期备份数据、与其他平台同步数据；

#### 示例代码

[eoapi to openapi](https://github.com/eolinker/eoapi-extensions/tree/main/packages/feature/export/openapi)

#### 配置

- 导出方式：`Named Exports`（命名导出）
- 导出类型：Function
- 方法名：自定义，但需要与配置中的 `action` 字段保持一致
- 传入参数：Eoapi 的 API 对象
- 返回值：合法的`JSON`对象
- 配置中的必要字段：
  - `action`：主函数名称
  - `label`：显示在 UI 上导出区域的名称
  - `filename`：导出的文件名

目前，导出后写入文件的操作由核心系统完成，因此导出的拓展只需要返回导出的文件内容。

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
