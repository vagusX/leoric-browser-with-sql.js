// production config
const { merge } = require('webpack-merge');
const { resolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'production',
  // mode: 'development',
  output: {
    filename: 'js/bundle.[contenthash].min.js',
    path: resolve(__dirname, '../../dist'),
    publicPath: '/',
  },
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
      '...',
    ],
  }
});
