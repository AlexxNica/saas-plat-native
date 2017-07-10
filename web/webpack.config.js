const path = require('path');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  //页面入口文件配置
  entry: {
    bundle: [
      path.normalize(__dirname + '/../index.web.js')
    ]
  },
  //入口文件输出配置
  output: {
    //publicPath: '/dist',
    path: __dirname + '/www/dist/',
    filename: '[name].[chunkhash:5].js'
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
          //'es2015',
          'es2017',
          // 'stage-0',
          // 'stage-1',
          // 'stage-2',
          // 'stage-3'
        ],
        'plugins': [
          //'transform-runtime',
          'transform-decorators-legacy'
        ]
      })]
    }, {
      test: /\.ttf$/,
      loader: "url-loader", // or directly file-loader
      include: path.resolve(__dirname,
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
  plugins: [
    new CopyWebpackPlugin([{
      from: path.join(__dirname,
        '../node_modules/babel-polyfill/dist/polyfill.min.js'),
      to: path.join(__dirname, 'www', 'dist')
    }]),
    new HtmlWebpackPlugin({
      template: __dirname + '/index.temp.html',
      filename: __dirname + '/www/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace:true,
        //conservativeCollapse: true,
        preserveLineBreaks: true,
        minifyCSS: true,
        removeScriptTypeAttributes:true,
        removeStyleLinkTypeAttributes:true
      }
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async'
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
