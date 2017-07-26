module.exports = function(args) {
  var fs = require('fs');
  var path = require('path');
  var express = require('express');
  var exec = require('child_process').exec;
  var root = path.dirname(__dirname);
  //var httpProxyMiddleware = require('http-proxy-middleware');
  var app = express();

  if (args.web) {
    var config = require('../web/webpack.config.dev');
    config.entry.main = path.isAbsolute(args.entry||'')
      ? args.entry
      : path.join(process.cwd(), args.entry || 'index.js');
    var webpack = require('webpack');
    var compiler = webpack(config);
    console.log('webpack-dev-middleware with webpack.config.dev')
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

    app.get('/favicon.ico', function(req, res) {
      res.write(fs.readFileSync(__dirname + '/../web/www/favicon.ico'));
      res.end();
    });

    app.get('/dist/polyfill.min.js', function(req, res) {
      res.sendFile(path.join(__dirname, '../node_modules/babel-polyfill/dist/polyfill.min.js'));
    });

    app.get('/dist/es6-promise.map', function(req, res) {
      res.sendFile(path.join(__dirname, '../node_modules/es6-promise/dist/es6-promise.map'));
    });
  }

  if (args.ios || args.android || args.windows || args.macos) {
    var nativecli = 'node ' + path.join(root, 'node_modules/react-native/local-cli/cli.js start');
    console.log(nativecli);
    var cli = exec(nativecli);
    cli.stdout.on('data', function(data) {
      console.log(data.replace('\n', ''));
    });
    cli.stderr.on('data', function(data) {
      console.error(data.replace('\n', ''));
    });

  }

  if (args.web) {
    app.get('/*', function(req, res) {
      res.write(md.fileSystem.readFileSync(__dirname + '/../web/www/index.html'));
      res.end();
    });
  }

  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  app.listen(8800, function(err) {
    if (err) {
      return console.error(err);
    }
    console.log('Listening at http://localhost:8800/');
  });
};
