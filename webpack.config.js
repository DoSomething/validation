'use strict';

var pkg = require('./package.json');
var fender = require('fender');

/**
 * Use Fender for nice and easy builds.
 * @see http://npmjs.com/fender
 */
var config = fender(pkg, {
  bundles: {
    'validation.js': './src/index.js'
  },
});

// Well... with one hack. We want to export this as a UMD module
// so it can be used in CommonJS builds or as a global in the browser.
config.output.library = 'DSValidation';
config.output.publicPath = '/dist/';
config.output.libraryTarget = 'umd';

module.exports = config;
