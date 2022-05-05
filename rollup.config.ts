const path = require('path')
const json = require('@rollup/plugin-json')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
// import type { OutputOptions, Plugin, RollupOptions } from 'rollup'

const pkg = process.env.TARGET
const resolve = (p) => {
  return path.resolve(`${__dirname}/packages/${pkg}`, p)
}
const { buildOptions } = require(resolve('package.json'))
const formatMap = {
  esm: {
    file: resolve(`dist/${pkg}.esm.js`),
    format: 'esm'
  },
  cjs: {
    file: resolve(`dist/${pkg}.cjs.js`),
    format: 'cjs'
  },
  umd: {
    file: resolve(`dist/${pkg}.js`),
    format: 'umd'
  }
}
const createConfig = (output) => {
  output.name = buildOptions.name
  return {
    input: resolve('src/index.ts'),
    output,
    plugins: [
      typescript(),
      json(),
      nodeResolve(),
      // 配合 commnjs 解析第三方模块
      nodeResolve(),

      // 使得 rollup 支持 commonjs 规范，识别 commonjs 规范的依赖
      commonjs()
    ]
  }
}

const configs = buildOptions.formats.map((format) =>
  createConfig(formatMap[format])
)

export default configs
