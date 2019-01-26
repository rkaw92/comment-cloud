'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const packageJSON = require('../../../package.json');

// Defaults - change this!
const defaultDataControllerIdent = `Snakeoil Inc.
1245 Long Winding Road
1010 Auckland, New Zealand`;
const defaultDataControllerContact = `snakeoil@example.com
555 055 055`;

// Make an options object to share among generated HTML files:
const commonOptions = {
  DATA_CONTROLLER_IDENT: process.env.DATA_CONTROLLER_IDENT || defaultDataControllerIdent,
  DATA_CONTROLLER_CONTACT: process.env.DATA_CONTROLLER_CONTACT || defaultDataControllerContact,
  PROJECT_HOMEPAGE: packageJSON.homepage || 'https://github.com/rkaw92/comment-cloud',
  DATA_PROCESSING_LOCATION: process.env.DATA_PROCESSING_LOCATION || 'within the European Union'
};

module.exports = {
  entry: path.resolve(__dirname, 'tos.js'),
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../../../assets/tos'),
    filename: 'bundle.js'
  },
  plugins: [
    new CopyWebpackPlugin([ path.resolve(__dirname, 'tos.css') ]),
    // TODO: Add a Terms of Service document:
    // new HtmlWebpackPlugin({
    //   filename: 'tos.html',
    //   template: path.resolve(__dirname, './tos.html'),
    //   options: commonOptions,
    // }),
    new HtmlWebpackPlugin(Object.assign({
      filename: 'privacy.html',
      template: path.resolve(__dirname, './privacy.html'),
    }, commonOptions))
  ]
};
