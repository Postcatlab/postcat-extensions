import { terser } from 'rollup-plugin-terser'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import inlineCode from 'rollup-plugin-inline-code'

export default [
  {
    input: 'src/operate.ts',
    output: {
      name: 'eoapi-opendlp',
      format: 'umd',
      file: 'dist/operate.js',
      sourcemap: 'inline'
    },
    plugins: [
      nodeResolve(),
      inlineCode(),
      esbuild({ target: 'esnext' }),
      terser()
    ]
  },
  {
    input: 'src/operate.ts',
    output: {
      format: 'es',
      file: 'dist/operate.d.ts'
    },
    plugins: [dts(), inlineCode()]
  }
]
