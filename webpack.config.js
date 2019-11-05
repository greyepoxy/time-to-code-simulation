var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  mode: 'development',
  entry: './lib/src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].bundle.js'
  },
  plugins: [new HtmlWebpackPlugin()]
};
