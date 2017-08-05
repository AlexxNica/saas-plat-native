var fs = require('fs');
var path = require('path');
var express = require('express');
//var httpProxyMiddleware = require('http-proxy-middleware');
var args = process.argv.slice(2);
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
require('./antd.config')(config);
var webpack = require('webpack');
config.entry = {
  main: [//'webpack-hot-middleware/client',
    __dirname + '/../demo.js']
};
// 调试只支持两种尺寸
var list = [ 'xs', 'sm'];
for (var s in list) {
  if (args.indexOf('--' + s)) {
    config.resolve.extensions.splice(0, 0, '.web.' + s + '.js', s + '.web.js', '.' + s + '.js');
    continue;
  }
}
// 这里需要加载当前项目包，要不测试时引用的第三方模块依赖加载有误
var dependencies = JSON.parse(fs.readFileSync(__dirname + '/../package.json')).dependencies;
for (var i in dependencies) {
  config.resolve.alias[i] = __dirname + '/../node_modules/' + i;
}
// 当前就是saas-plat-native
config.resolve.alias['react-native'] = __dirname + '/../node_modules/react-native-web';
config.resolve.alias['saas-plat-native'] = __dirname + '/../src';
config.resolve.alias['saas-plat-ui'] = __dirname + '/../../saas-plat-ui';
//console.log(config.resolve.alias) 定义模拟数据，和调试状态
config.plugins.push(new webpack.DefinePlugin({'__MOCK__': true, '__TEST__': true}));
var compiler = webpack(config);
console.log('webpack-dev-middleware with webpack.config.dev');
compiler.apply(new webpack.ProgressPlugin(require('../cli/webpack-progress-bar-handler')()));
var md = require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  noInfo: true,
  historyApiFallback: true,
  watchOptions: {
    aggregateTimeout: 100,
    poll: 3000
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
  res.sendFile(path.join(__dirname, '../node_modules/babel-polyfill/dist/polyfill.min.js'));
});

app.get('/dist/viewport.min.js', function(req, res) {
  res.sendFile(__dirname + '/www/dist/viewport.min.js');
});

app.get('/dist/es6-promise.map', function(req, res) {
  res.sendFile(path.join(__dirname, '../node_modules/es6-promise/dist/es6-promise.map'));
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
