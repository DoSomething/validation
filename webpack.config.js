var config = require('@dosomething/webpack-config');

module.exports = config({
  entry: {
    validation: './src/validation',
  },

  // Don't bundle the 'jquery' package with the library (forge.js), but
  // instead load from `jQuery` global variable or AMD/CJS package.
  externals: {
    'jquery': {
      root: 'jQuery',
      commonjs2: 'jquery',
      amd: 'jquery'
    }
  },
});
