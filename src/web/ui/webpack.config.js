'use strict';

const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    verify: './verify.js'
  },
  mode: 'development',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '../../../assets'),
    filename: '[name].bundle.js',
    libraryTarget: 'var'
    // We export nothing and do no assignments to globals.
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.css$/,
      use: [
        'vue-style-loader',
        'css-loader'
      ]
    }]
  },
  externals: {
    //vue: 'Vue'
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'verify.html',
      template: path.resolve(__dirname, './verify.html')
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'initial'
    }
  }
};
