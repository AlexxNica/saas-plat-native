var url = require('url');
var fs = require('fs');
var path = require('path');
var express = require('express');
var exec = require('child_process').exec;
var root = path.dirname(__dirname);
//var httpProxyMiddleware = require('http-proxy-middleware');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var args = process.argv.splice(2);

io.on('connection', function(socket) {
  console.log('socket connected ');
  socket.on('message', function (data) {
     console.log('received message ', data);
  });
  socket.on('disconnect', function () {
      console.log('socket disconnected ');
  });
});

io.of('/chat').on('connection', function(socket) {
  console.log('chat socket connected ');
  socket.on('message', function (data) {
     console.log('received chat message ', data);
  });
  socket.on('disconnect', function () {
      console.log('chat socket disconnected ');
  });
});

if (args.indexOf('--web') > -1) {
  var config = require('../web/webpack.config.dev');
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

  app.get('/usr/account/sso/login', function(req, res) {
    res.redirect(req.query.redirect+'?token=aaaaaaaaaaaaaaaaaaaaaaaa');
    res.end();
  });

  app.get('/favicon.ico', function(req, res) {
    res.write(fs.readFileSync(__dirname + '/../web/www/favicon.ico'));
    res.end();
  });

  app.get('/dist/polyfill.min.js', function(req, res) {
    res.sendFile(path.join(__dirname, '../node_modules/babel-polyfill/dist/polyfill.min.js'));
  });

}

if (args.indexOf('--ios') > -1 || args.indexOf('--android') > -1 || args.indexOf('--windows') > -1) {
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

function api(request, response) {
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
}

app.get('/api/v1/*', api);
app.post('/api/v1/*', api);
app.delete('/api/v1/*', api);
app.put('/api/v1/*', api);

if (args.indexOf('--web') > -1) {
  app.get('/*', function(req, res) {
    res.write(md.fileSystem.readFileSync(__dirname + '/../web/www/index.html'));
    res.end();
  });
}

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
