// shared config (dev and prod)
const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './index.ts',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    fallback: {
      fs: false,
    },
  },
  context: resolve(__dirname, '../../src'),
  module: {
    rules: [
      {
        test: [/\.jsx?$/, /\.tsx?$/],
        use: ['babel-loader'],
        exclude: /node_modules/,
        include: [resolve(__dirname, '../../src'), /node_modules\/leoric/],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({ template: 'index.html.ejs' }),
    new CopyWebpackPlugin({
      patterns: [
        require.resolve('sql.js/dist/sql-wasm.wasm'),
        // require.resolve('sql.js/dist/worker.sql-wasm.js'),
        // require.resolve('sql.js/dist/worker.sql-wasm-debug.js'),
      ],
    }),
    new webpack.ContextReplacementPlugin(/leoric/),
    new webpack.NormalModuleReplacementPlugin(
      /^perf_hooks$/,
      resolve(__dirname, '../../src/dummy/perf_hooks.js'),
    ),
    new webpack.NormalModuleReplacementPlugin(
      /^assert$/,
      resolve(__dirname, '../../src/dummy/assert.js'),
    ),
  ],
};
