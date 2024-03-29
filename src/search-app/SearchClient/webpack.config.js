﻿/// <binding ProjectOpened='Hot' />
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var pkg = require('./package.json');

// bundle dependencies in separate vendor bundle
var vendorPackages = Object.keys(pkg.dependencies).filter(function (el) {
  return el.indexOf('font') === -1; // exclude font packages from vendor bundle
});
var outputFileTemplateSuffix = '-' + pkg.version;


module.exports = function (env) {

  env = env || {};
  var isProd = env.NODE_ENV === 'production';

  // Setup base config for all environments
  var config = {
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV || 'development'),
        'process.env.REACT_APP_VERSION': `\'${pkg.version}\'`
      }),
      new HtmlWebpackPlugin({
        template: 'index.html'
      })
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader',
          include: __dirname
        }, {
          test: /\.css?$/,
          use: ['style-loader', 'raw-loader'],
          include: __dirname
        }
      ]
    }
  }

  // Set environment-specific properties to the config
  if (isProd) {
    config.entry = {
      main: './app/index',
      vendor: vendorPackages
    };
    config.output = {
      path: path.join(__dirname, 'dist'),
      filename: '[name]' + outputFileTemplateSuffix + '.js',
      chunkFilename: '[id]' + outputFileTemplateSuffix + '.js'
    };
  } else { // dev 
    config.devServer = {
      static: './build',
      host: 'localhost',
      port: 3000
    };
    config.entry = {
      main: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        './app/index'
      ],
      vendor: vendorPackages
    };
    config.output = {
      path: path.join(__dirname, 'build'),
      filename: '[name].js'
    };
  }

  return config;
};