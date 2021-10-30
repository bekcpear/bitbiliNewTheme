const path = require('path');

module.exports = {
  mode: 'development', //'production',
  entry: './src/js/common.js',
  output: {
    path: path.resolve(__dirname, 'dist/assets/js'),
    filename: 'common.js',
  },
};
