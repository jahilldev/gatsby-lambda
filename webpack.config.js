const path = require('path');
const fs = require('fs');
const nodeExternals = require('webpack-node-externals');
const CopyPackage = require('copy-pkg-json-webpack-plugin');

/* -----------------------------------
 *
 * Webpack
 *
 * -------------------------------- */

module.exports = {
  entry: ['./src/lambda.ts'],
  mode: 'production',
  target: 'node',
  context: __dirname,
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')],
    extensions: ['*', '.mjs', '.js', '.json', '.gql', '.graphql'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      },
    ],
  },
  plugins: [
    new CopyPackage({
      remove: ['devDependencies'],
      replace: { scripts: { start: 'node index.js' } },
    }),
  ],
  externals: [nodeExternals()],
  output: {
    libraryTarget: 'umd',
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js',
  },
  stats: {
    warnings: false,
  },
};
