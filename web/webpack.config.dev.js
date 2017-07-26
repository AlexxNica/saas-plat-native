var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-source-map',
  //页面入口文件配置
  entry: {
    // app: [
    //   //'webpack-hot-middleware/client',
    //   __dirname + '/../index.web.js'
    // ]
  },
  //入口文件输出配置
  output: {
    publicPath: 'http://localhost:8800/dist',
    path: path.join(__dirname, 'www', 'dist'),
    filename: '[name].js'
  },
  module: {
    //加载器配置
    loaders: [{
      test: /\.js|\.jsx$/,
      //exclude: /node_modules[\\|\/](?!react-native|@shoutem\\theme|@remobile\\react-native)/,
      loaders: [
        //'react-hot',
         'babel?' + JSON.stringify({
          //retainLines: true, 'compact':false,
          'presets': [
            'react',
            //'es2015',
            'es2017',
            // 'stage-0',
            // 'stage-1',
            // 'stage-2',
            // 'stage-3'
          ],
          'plugins': [ //'transform-runtime',
            'transform-decorators-legacy'
          ]
        })
      ]
    }, {
      test: /\.ttf$/,
      loader: "url-loader", // or directly file-loader
      include: path.resolve(__dirname,
        (process.cwd() !== path.dirname(__dirname) ? '../../' : '') +
        "../node_modules/react-native-vector-icons"),
    }]
  },
  //其它解决方案配置
  resolve: {
    extensions: [
      '', '.web.js', '.js'
    ],
    alias: {
      'react-native': 'react-native-web'
    }
  },
  //插件项
  plugins: [
    new CopyWebpackPlugin([{
      from: path.join(__dirname,
        (process.cwd() !== path.dirname(__dirname) ? '../../' : '') +
        '../node_modules/babel-polyfill/dist/polyfill.min.js'),
      to: path.join(__dirname, 'www', 'dist')
    }]),
    new HtmlWebpackPlugin({
      template: __dirname + "/index.temp.html",
      filename: __dirname + '/www/index.html'
    }),
    //new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    //new ChunkModuleIDPlugin(),
    new webpack.DefinePlugin({ '__DEV__': true }),
    //new webpack.ProvidePlugin({'__DEV__': 'true'})
    // new webpack.optimize.UglifyJsPlugin({   compress: {     //supresses warnings,
    // usually from module minification     warnings: false   },   sourceMap: true,
    //   mangle: false })
  ]
};
