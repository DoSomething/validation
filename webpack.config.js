'use strict';

var config = require('@dosomething/webpack-config');

module.exports = config({
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
