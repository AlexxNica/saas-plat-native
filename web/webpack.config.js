const path = require('path');
const webpack = require('webpack');
var ChunkModuleIDPlugin = require('./ChunkModuleIDPlugin');

module.exports = {
  //页面入口文件配置
  entry: {
    bundle: [
      path.normalize(__dirname + '/../index.web.js')
    ]
  },
  //入口文件输出配置
  output: {
    publicPath: '/',
    path: __dirname + '/dist/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  module: {
    //加载器配置
    loaders: [{
      test: /\.js|\.jsx$/,
      exclude: /node_modules/,
      loaders: [
        'babel-loader?' + JSON.stringify({
          'compact': false,
          'presets': [
            'react', 'es2015', 'es2017', 'stage-0', 'stage-1', 'stage-2', 'stage-3'
          ],
          'plugins': [
            'transform-runtime',
            'transform-decorators-legacy'
          ]
        })
      ]
    }, {
      test: /\.less|\.css$/,
      //exclude: /node_modules/,
      loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'
    }, {
      test: /\.scss$/,
      //exclude: /node_modules/,
      loader: 'style-loader!css-loader!autoprefixer-loader!scss-loader'
    }, {
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$|\.(eot?|woff?|woff2?|ttf?|svg?|png?|jpg?|gif?)/,
      loader: 'url-loader?limit=8192&name=[name].[ext]'
    }]
  },
  //其它解决方案配置
  resolve: {
    extensions: ['', '.js', '.web.js', '.less', '.css'],
    alias: {
      'react-native': 'react-native-web'
    }
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new ChunkModuleIDPlugin(),
    //new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      '__DEV__': true,
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        //supresses warnings, usually from module minification
        warnings: false
      }
    }),

  ]
};
