var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('../web/webpack.config');
var httpProxyMiddleware = require('http-proxy-middleware');

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  noInfo: false,
  historyApiFallback: true,
  watchOptions: {
    aggregateTimeout: 100,
    poll: 2000
  },
  stats: {
    colors: true
  }
}));

app.use(require('webpack-hot-middleware')(compiler));

//代理
var proxy = httpProxyMiddleware('/tplus', {
  target: 'http://api.saas-plat.com',
  changeOrigin: true,
  logLevel: 'debug'
});

app.use('/tplus', proxy);

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'web', 'www', 'index.html'));
});

app.listen(8300, function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at http://localhost:8300/');
});
