const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const images = {
  test: /\.(png|jpg)$/,
  loader: 'url-loader'
}

const styles = {
  test: /\.(scss|css)$/,
  use: ExtractTextPlugin.extract(['css-loader?sourceMap', 'sass-loader?sourceMap'])
}

module.exports = {
  entry: {
    app: './public/javascripts/chefit.js'
  },
  devtool: 'source-map',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public', 'dist')
  },
  module: {
    rules: [styles, images]
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    // new webpack.ProvidePlugin({
    //   $: "jquery",
    //   jQuery: "jquery"
    // })
  ]
}