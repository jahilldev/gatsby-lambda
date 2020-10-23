const path = require('path');

/* -----------------------------------
 *
 * Dependencies
 *
 * -------------------------------- */

const dependencies = [
  'gatsby',
  'gatsby-cli',
  'buble-jsx-only',
  '@mdx-js/mdx',
  '@pmmmwh/react-refresh-webpack-plugin',
  'babel-runtime',
  'core-js-compat',
  'joi',
];

/* -----------------------------------
 *
 * Webpack
 *
 * -------------------------------- */

module.exports = {
  entry: ['./src/lambda.js'],
  mode: 'development',
  target: 'node',
  context: __dirname,
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      ...dependencies.map((item) =>
        path.resolve(__dirname, 'node_modules', item, 'node_modules')
      ),
    ],
    extensions: ['*', '.mjs', '.js', '.json', '.gql', '.graphql'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['shebang-loader'],
      },
    ],
  },
  externals: ['path', 'worker_threads', 'pnpapi'],
  output: {
    libraryTarget: 'umd',
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js',
  },
  stats: {
    warnings: false,
  },
};
