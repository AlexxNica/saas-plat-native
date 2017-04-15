const path = require('path');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ChunkModuleIDPlugin = require('./ChunkModuleIDPlugin');

module.exports = {
  //页面入口文件配置
  entry: {
    bundle: [
      "babel-polyfill",
      path.normalize(__dirname + '/../index.web.js')
    ]
  },
  //入口文件输出配置
  output: {
    //publicPath: '/dist',
    path: __dirname + '/www/dist/',
    filename: '[name].[hash:5].js',
    chunkFilename: '[name].chunk.[hash:5].js'
  },
  module: {
    //加载器配置
    loaders: [{
      test: /\.js|\.jsx$/,
      exclude: /node_modules[\\|\/](?!react-native|@shoutem\\theme|@remobile\\react-native)/,
      loaders: ['babel-loader?' + JSON.stringify({
        'compact': false,
        'presets': [
          'react',
          'es2015',
          'es2017',
          'stage-0',
          'stage-1',
          'stage-2',
          'stage-3'
        ],
        'plugins': [
          //'transform-runtime',
          'transform-decorators-legacy'
        ]
      })]
    }]
  },
  //其它解决方案配置
  resolve: {
    extensions: [
      '', '.web.js', '.js', '.less', '.css'
    ],
    alias: {
      'react-native': 'react-native-web'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/index.temp.html',
      filename: __dirname + '/www/index.html'
    }),
    new webpack.optimize.DedupePlugin(),
    //new ChunkModuleIDPlugin(), new webpack.NoErrorsPlugin(),
     new webpack.DefinePlugin({ '__DEV__': false, 'process.env.NODE_ENV': '"production"' }),
    // new webpack.ProvidePlugin({ '__DEV__': false }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        //supresses warnings, usually from module minification
        warnings: false
      },
      sourceMap: true,
      mangle: true
    })
  ]
};
