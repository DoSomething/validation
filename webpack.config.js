'use strict';

var configurator = require('@dosomething/webpack-config');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

var config = configurator({
  entry: {
    validation: './index.js'
  },

  output: {
    publicPath: '/dist/',
  },

  // Don't bundle the 'jquery' package with the library (validation.js), but
  // instead load from `jQuery` global variable or AMD/CJS package.
  externals: {
    'jquery': {
      root: 'jQuery',
      commonjs2: 'jquery',
      amd: 'jquery'
    }
  },
});

// Add the LodashModuleReplacementPlugin to shrink bundle size.
// @see https://github.com/lodash/lodash-webpack-plugin
config.plugins.push(new LodashModuleReplacementPlugin);

module.exports = config;
