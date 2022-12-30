import { terser } from 'rollup-plugin-terser'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default [
  {
    input: 'src/index.ts',
    output: {
      name: 'postcat-push-eolink',
      format: 'umd',
      file: 'dist/index.js',
      sourcemap: 'inline'
    },
    plugins: [nodeResolve(), esbuild({ target: 'esnext' }), terser()]
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
