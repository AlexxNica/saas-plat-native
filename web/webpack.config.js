const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    path.join(__dirname, '../index.web.js')
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader?cacheDirectory=true'
        ]
      },
      {
        test: /\.(gif|jpe?g|png|svg)$/,
        loader: 'url-loader',
        query: { name: '[name].[hash:16].[ext]' }
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'www', 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': 'production'
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  resolve: {
    alias: {
      'react-native': 'react-native-web'
    }
  }
};
