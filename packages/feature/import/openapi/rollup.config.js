import { terser } from 'rollup-plugin-terser'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'

export default [
  {
    input: 'src/index.ts',
    output: {
      name: 'eoapi-import-openapi',
      format: 'umd',
      file: 'dist/index.js',
      sourcemap: 'inline'
    },
    plugins: [esbuild({ target: 'esnext' }), terser()]
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
