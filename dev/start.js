var url = require('url');
var fs = require('fs');
var path = require('path');
var express = require('express');
var exec = require('child_process').exec;
var root = path.dirname(__dirname);
//var httpProxyMiddleware = require('http-proxy-middleware');

var app = express();

var args = process.argv.splice(2);

if (args.indexOf('--web') > -1) {
  var config = require('../web/webpack.config.dev');
  var webpack = require('webpack');
  var compiler = webpack(config);
  console.log('webpack-dev-middleware')
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

  app.get('/', function(req, res) {
    res.write(md.fileSystem.readFileSync(__dirname + '/../web/www/index.html'));
    res.end();
  });

  app.get('/favicon.ico', function(req, res) {
    res.write(fs.readFileSync(__dirname + '/../web/www/favicon.ico'));
    res.end();
  });
}

if (args.indexOf('--ios') > -1 || args.indexOf('--android') > -1) {
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

//require('./buildSrc');
var buildSrc = 'node ' + path.join(__dirname, 'buildSrc.js ' + args.join(' '));
var cli = exec(buildSrc);
console.log(buildSrc);
cli.stdout.on('data', function(data) {
  console.log(data.replace('\n', ''));
});
cli.stderr.on('data', function(data) {
  console.error(data.replace('\n', ''));
});

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

app.get('/assets/*', function(req, res) {
  var pathname = url.parse(req.url).pathname;
  res.write(fs.readFileSync(__dirname + '/bundles' + pathname));
  res.end();
});

app.get('/api/v1/*', function(request, response) {
  var pathname = url.parse(request.url).pathname;
  var realPath = path.join(__dirname, 'api', pathname.substr('/api/v1'.length), request.method.toLocaleLowerCase() + '.js');
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

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8202, function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at http://localhost:8202/');

});
