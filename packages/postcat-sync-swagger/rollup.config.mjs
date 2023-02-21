import json from '@rollup/plugin-json';
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default [
  {
    input: 'src/index.ts',
    output: {
      name: 'postcat-export-postcat',
      format: 'umd',
      file: 'dist/index.js',
      sourcemap: 'inline',
      externalImportAssertions: true,
      globals: {
        lodash: 'lodash'
      }
    },
    plugins: [json(),nodeResolve(), esbuild({ target: 'esnext' })]
  },
  {
    input: 'src/index.ts',
    output: {
      externalImportAssertions: true,
      format: 'es',
      file: 'dist/index.d.ts'
    },
    plugins: [dts()]
  }
]
