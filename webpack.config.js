const path = require('path');
const fs = require('fs');
const { BannerPlugin } = require('webpack');
const nodeExternals = require('webpack-node-externals');
const CopyPackage = require('copy-pkg-json-webpack-plugin');

/* -----------------------------------
 *
 * Variables
 *
 * -------------------------------- */

const efsMountPath = '/mnt/efs/node/node_modules';

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
    extensions: ['*', '.mjs', '.ts', '.js', '.json', '.gql', '.graphql'],
    alias: {
      '@': path.resolve('./src'),
    },
  },
  node: {
    __dirname: false,
    __filename: false,
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
    new BannerPlugin({
      banner: `
        require('app-module-path').addPath('${efsMountPath}');
        process.env.NODE_ENV = 'production';
      `,
      raw: true,
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
