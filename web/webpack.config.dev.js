var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'cheap-module-source-map',
  //页面入口文件配置
  entry: {
    main: [
      //'webpack/hot/dev-server',
      'webpack-hot-middleware/client',
      '../index.web.js'
    ]
  },
  //入口文件输出配置
  output: {
    publicPath: 'http://localhost:8300/dist/',
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  module: {
    //加载器配置
    loaders: [{
      test: /\.js|\.jsx$/,
      exclude: /node_modules/,
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
    extensions: ['', '.js', '.jsx', '.less', '.css']
  },
  //插件项
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      '__DEV__': true
    })
  ]
};
