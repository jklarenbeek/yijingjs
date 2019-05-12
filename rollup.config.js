import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';

import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: {
    file: pkg.main,
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    serve({
      contentBase: pkg.files,
    })
  ],
}
