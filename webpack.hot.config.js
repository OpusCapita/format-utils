const webpack = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');
const merge = require('webpack-merge');
const devConfig = require('./webpack.config');

const hotConfig = {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new WriteFilePlugin({ log: false }),
  ],
  devServer: {
    noInfo: true,
    quiet: false,
    port: 5555,
    historyApiFallback: true,
    clientLogLevel: 'error',
    hotOnly: true,
    inline: true,
    stats: { colors: true },
  },
};

const mergedConfig = merge(devConfig, hotConfig);

module.exports = mergedConfig;
