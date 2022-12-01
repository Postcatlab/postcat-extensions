import dts from 'rollup-plugin-dts' // 生成 d.ts 文件
import resolve from '@rollup/plugin-node-resolve' // 在 node_modules 中找到并捆绑第三方依赖项
import commonjs from '@rollup/plugin-commonjs' // 将 CommonJS 模块转换为 ES6
import json from '@rollup/plugin-json' // 将 .json 文件转换为 ES6 模块
import alias from '@rollup/plugin-alias' // 定义和解析捆绑包依赖项的别名
import esbuild from 'rollup-plugin-esbuild' // Rollup 和 Esbuild 之间的集成
import babel from '@rollup/plugin-babel' // 使用 Babel 编译文件
import { defineConfig } from 'rollup'

import pkg from './package.json' assert { type: 'json' }

const plugins = [
  babel({
    babelrc: false,
    babelHelpers: 'bundled',
    presets: [['env', { modules: false }]]
  }),
  resolve({
    preferBuiltins: true
  }),
  alias(),
  json(),
  commonjs(),
  esbuild()
]

export default defineConfig([
  {
    input: 'src/index.ts', // 源文件入口
    output: [
      {
        file: 'dist/index.esm.js', // package.json 中 "module": "dist/index.esm.js"
        format: 'esm', // es module 形式的包， 用来import 导入， 可以tree shaking
        sourcemap: true
      },
      {
        file: 'dist/index.cjs.js', // package.json 中 "main": "dist/index.cjs.js",
        format: 'cjs', // commonjs 形式的包， require 导入
        sourcemap: true
      },
      {
        name: pkg.name,
        file: 'dist/index.umd.js',
        format: 'umd', // umd 兼容形式的包， 可以直接应用于网页 script
        sourcemap: true
      }
    ],
    plugins
  },
  {
    input: 'src/index.ts', // 源文件入口
    output: {
      file: 'index.d.ts',
      format: 'esm'
    },
    external: [],
    plugins: [dts({ respectExternal: true })]
  }
])
