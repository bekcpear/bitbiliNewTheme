const path = require('path');

module.exports = {
  //mode: 'development',
  mode: 'production',
  entry: './src/js/service-worker.js',
  output: {
    path: path.resolve(__dirname, 'dist/assets/js'),
    filename: 'sw.js',
  },
};
