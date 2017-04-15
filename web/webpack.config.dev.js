var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ChunkModuleIDPlugin = require('./ChunkModuleIDPlugin');

module.exports = {
  devtool: 'cheap-module-source-map',
  //页面入口文件配置
  entry: {
    bundle: [
      'webpack-hot-middleware/client',
      //"babel-polyfill",
      __dirname + '/../index.web.js'
    ]
  },
  //入口文件输出配置
  output: {
    publicPath: 'http://localhost:8202/dist',
    path: path.join(__dirname, 'www', 'dist'),
    filename: '[name].[hash:5].js',
    chunkFilename: '[name].chunk.[hash:5].js'
  },
  module: {
    //加载器配置
    loaders: [
      {
        test: /\.js|\.jsx$/,
        exclude: /node_modules[\\|\/](?!react-native|@shoutem\\theme|@remobile\\react-native)/,
        loaders: [
          'react-hot', 'babel?' + JSON.stringify({
            //retainLines: true, 'compact':false,
            'presets': [
              'react',
              'es2015',
              'es2017',
              'stage-0',
              'stage-1',
              'stage-2',
              'stage-3'
            ],
            'plugins': [//'transform-runtime',
              'transform-decorators-legacy']
          })
        ]
      }
    ]
  },
  //其它解决方案配置
  resolve: {
    extensions: [
      '', '.js', '.web.js', '.less', '.css'
    ],
    alias: {
      'react-native': 'react-native-web'
    }
  },
  //插件项
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + "/index.temp.html",
      filename: __dirname + '/www/index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    //new ChunkModuleIDPlugin(),
    new webpack.DefinePlugin({'__DEV__': true}),
    //new webpack.ProvidePlugin({'__DEV__': 'true'})
    // new webpack.optimize.UglifyJsPlugin({   compress: {     //supresses warnings,
    // usually from module minification     warnings: false   },   sourceMap: true,
    //   mangle: false })
  ]
};
