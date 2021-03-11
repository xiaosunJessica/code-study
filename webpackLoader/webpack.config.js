const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webpack.bundle.js'
  },
  module: {
    rules: [{
      test: /.js$/,
      use: path.resolve(__dirname, 'loaders/trycatchLoader.js')
    }]
  }
}