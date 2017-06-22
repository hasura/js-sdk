import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import resolve from 'rollup-plugin-node-resolve';

export default {
  moduleName: 'hasura',
  entry: 'src/main.js',
  dest: 'build/js/main.min.js',
  format: 'iife',
  sourceMap: 'inline',
  moduleContext: { 'node_modules/whatwg-fetch/fetch.js': 'window' },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    eslint({}),
    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    (process.env.NODE_ENV === 'production' && uglify()),
  ]
};
