import path from 'path'
import json from '@rollup/plugin-json'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import nodeResolve from '@rollup/plugin-node-resolve'

const pkg = process.env.TARGET

const defaultBuildOptions = {
  name: pkg || 'index',
  formats: ['esm', 'cjs', 'umd', 'dts']
}

const resolve = (p) => {
  return path.resolve(`${__dirname}/packages/${pkg}`, p)
}
const { buildOptions = defaultBuildOptions } = require(resolve('package.json'))

const formatMap = {
  esm: {
    file: resolve(`dist/index.esm.js`),
    format: 'esm'
  },
  cjs: {
    file: resolve(`dist/index.cjs.js`),
    format: 'cjs'
  },
  umd: {
    file: resolve(`dist/index.js`),
    format: 'umd'
  },
  dts: {
    file: resolve(`dist/index.d.ts`),
    format: 'es'
  }
}
const createConfig = (output, format = 'es') => {
  output.name = buildOptions.name
  return {
    input: resolve('src/index.ts'),
    output,
    plugins:
      format === 'dts'
        ? [dts()]
        : [
            nodeResolve(),
            esbuild({ target: 'esnext', legalComments: 'none', minify: true }),
            json()
          ]
  }
}

const configs = buildOptions.formats.map((format) =>
  createConfig(formatMap[format], format)
)

export default configs
