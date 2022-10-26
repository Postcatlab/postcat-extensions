import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  input: 'src/index.js',
  output: `dist/index.js`,
  plugins: [nodeResolve({ jsnext: true }), commonjs()],
  format: 'umd'
}
