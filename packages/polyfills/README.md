# postcat polyfills

[![layout](https://img.shields.io/npm/dw/@postcat/polyfills.svg)](https://www.npmjs.com/package/@postcat/polyfills)
[![npm package](https://img.shields.io/npm/v/@postcat/polyfills.svg?style=flat-square?style=flat-square)](https://www.npmjs.com/package/@postcat/polyfills)

## 简介

主要用于某些场景下，插件系统需要加载特定的 polyfill 脚本以兼容模式运行在 Postcat 上。

## 安装

```bash
yarn add @postcat/polyfills
```

## 使用

```bash
import '@postcat/polyfills'
```

## Polyfills

| 名称        | 说明                                           |
| ----------- | ---------------------------------------------- |
| setupIframe | 插件自定义页面使用 iframe 加载时需要调用此函数 |
