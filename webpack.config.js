const path = require('path');

module.exports = {
  mode: 'development', //'production',
  //mode: 'production',
  entry: {
    common: './src/js/common.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist/assets/js'),
    filename: '[name].js',
  },
};
