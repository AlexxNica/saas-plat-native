var url = require('url');
var fs = require('fs');
var path = require('path');
var express = require('express');
//var httpProxyMiddleware = require('http-proxy-middleware');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket) {
  console.log('socket connected ');
  socket.on('message', function(data) {
    console.log('received message ', data);
  });
  socket.on('disconnect', function() {
    console.log('socket disconnected ');
  });
});

io.of('/chat').on('connection', function(socket) {
  console.log('chat socket connected ');
  socket.on('message', function(data) {
    console.log('received chat message ', data);
  });
  socket.on('disconnect', function() {
    console.log('chat socket disconnected ');
  });
});

var config = require('../web/webpack.config.dev');
var webpack = require('webpack');
config.entry = {
  main: [
    //'webpack-hot-middleware/client',
    __dirname + '/../index.web.js'
  ]
};
config.plugins.push(new webpack.DefinePlugin({ '__MOCK__': true , '__TEST__': true}));
var compiler = webpack(config);
console.log('webpack-dev-middleware with webpack.config.dev');
compiler.apply(new webpack.ProgressPlugin(require('../cli/webpack-progress-bar-handler')()));
var md = require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  noInfo: true,
  historyApiFallback: true,
  watchOptions: {
    aggregateTimeout: 100,
    poll: 2000
  },
  stats: {
    colors: true
  }
});
app.use(md);

app.use(require('webpack-hot-middleware')(compiler));

// 代理 var proxy = httpProxyMiddleware('/api', {   target:
// 'http://api.saas-plat.com',   changeOrigin: true,   logLevel: 'debug' });
//
// app.use('/api', proxy);

app.get('/favicon_32.ico', function(req, res) {
  res.write(fs.readFileSync(__dirname + '/www/favicon_32.ico'));
  res.end();
});

app.get('/dist/polyfill.min.js', function(req, res) {
  res.sendFile(path.join(__dirname,
    '../node_modules/babel-polyfill/dist/polyfill.min.js'));
});

app.get('/dist/es6-promise.map', function(req, res) {
  res.sendFile(path.join(__dirname,
    '../node_modules/es6-promise/dist/es6-promise.map'));
});

app.get('/*', function(req, res) {
  res.write(md.fileSystem.readFileSync(__dirname + '/www/index.html'));
  res.end();
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8200, function(err) {
  if (err) {
    return console.error(err);
  }
  console.log('Listening at http://localhost:8200/');
});
