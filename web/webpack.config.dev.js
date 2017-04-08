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
    loaders: [{
      test: /\.js|\.jsx$/,
      exclude: /node_modules[\\|\/](?!react-native-storage|@remobile\\react-native-splashscreen|react-native-locale-detector)/,
      loaders: [
        'react-hot',
        'babel?' + JSON.stringify({
          //retainLines: true,
          //'compact':false,
          'presets': [
            'react',
            'es2015',
            'es2017',
            'stage-0',
            'stage-1'
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
    new webpack.DefinePlugin({
      '__DEV__': true
    })
  ]
};
