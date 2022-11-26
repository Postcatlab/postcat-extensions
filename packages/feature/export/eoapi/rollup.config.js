import { terser } from 'rollup-plugin-terser'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default [
  {
    input: 'src/index.ts',
    output: {
      name: 'eoapi-export-openapi',
      format: 'umd',
      file: 'dist/index.js',
      sourcemap: 'inline',
      globals: {
        lodash: 'lodash'
      }
    },
    plugins: [nodeResolve(), esbuild({ target: 'esnext' })]
  },
  {
    input: 'src/index.ts',
    output: {
      format: 'es',
      file: 'dist/index.d.ts'
    },
    plugins: [dts()]
  }
]
