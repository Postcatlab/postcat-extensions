import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import pkgInfo from './package.json' 
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/index.ts',
    output: {
      name: pkgInfo.name,
      format: 'umd',
      file: 'dist/index.js',
      sourcemap: 'inline',
      externalImportAssertions: true, 
    },
    plugins: [commonjs(),json(),nodeResolve(), esbuild({ target: 'esnext' })]
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
