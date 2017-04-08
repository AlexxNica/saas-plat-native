var url = require('url');
var fs = require('fs');
var mine = require('./mine').types;
var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('../web/webpack.config.dev');
var httpProxyMiddleware = require('http-proxy-middleware');

var app = express();
var compiler = webpack(config);

var arguments = process.argv.splice(2);

if (arguments.indexOf('--web')>-1) {
  console.log('启用web');

  var md = require('webpack-dev-middleware')(compiler, {
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
  });

  app.use(md);

  app.use(require('webpack-hot-middleware')(compiler));

  // 代理 var proxy = httpProxyMiddleware('/api', {   target:
  // 'http://api.saas-plat.com',   changeOrigin: true,   logLevel: 'debug' });
  //
  // app.use('/api', proxy);

  app.get('/', function(req, res) {
    res.write(md.fileSystem.readFileSync(__dirname + '/../web/www/index.html'));
  });
}

global.t = function(txt) {
  return txt;
}

global.readJsonFile = function(filename) {
  var json3 = {};
  if (fs.existsSync(filename)) {
    var packagefile = fs.readFileSync(filename);
    json3 = JSON.parse(packagefile);
  }
  return json3;
}

console.log('启用/api/v1');
app.get('/api/v1/*', function(request, response) {
  var pathname = url.parse(request.url).pathname;
  var realPath = path.join(__dirname, 'api', pathname.substr('/api/v1'.length) , request.method.toLocaleLowerCase() + '.js');
  console.log(realPath);
  fs.exists(realPath, function(exists) {
    if (!exists) {
      response.writeHead(404, {'Content-Type': 'application/json;charset=utf-8'});
      response.write("This request URL " + pathname + " was not found on this server.");
      response.end();
    } else {
      delete require.cache[realPath];
      if (require(realPath).custom) {
        try {
          require(realPath).custom(request, response);
        } catch (err) {
          console.log(err.stack);
          console.log(err);
          response.end();
        }
      } else {
        var contentType = 'application/json;charset=utf-8';
        response.writeHead(200, {'Content-Type': contentType});
        var data;
        try {
          //console.log(require.cache);
          data = require(realPath).default();
        } catch (err) {
          console.log(err.stack);
          console.log(err);
        }
        response.write(JSON.stringify({
          errno: 0,
          data: data
        }, null, 2));
        response.end();
      }
    }
  });
});

app.listen(8202, function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at http://localhost:8202/');
});

function noop() {}
process.on('uncaughtException', noop)
