import { terser } from 'rollup-plugin-terser'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'

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
    plugins: [esbuild({ target: 'esnext' })]
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
