var PORT = 8202;

var http = require('http');
var url = require('url');
var fs = require('fs');
var mine = require('./mine').types;
var path = require('path');

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

function getJson(request, response) {
  var pathname = url.parse(request.url).pathname;
  var realPath = path.join(__dirname, "json", pathname + '/' + request.method +
    '.json');
  console.log(realPath);
  var ext = path.extname(realPath);
  ext = ext ?
    ext.slice(1) :
    'unknown';
  fs.exists(realPath, function(exists) {
    if (!exists) {
      response.writeHead(404, { 'Content-Type': 'application/json;charset=utf-8' });
      response.write("This request URL " + pathname +
        " was not found on this server.");
      response.end();
    } else {
      fs.readFile(realPath, function(err, file) {
        if (err) {
          response.writeHead(500);
          response.end(err);
        } else {
          var contentType = mine[ext] ||
            'application/json;charset=utf-8';
          response.writeHead(200, { 'Content-Type': contentType });
          if (ext == 'json') {
            var json;
            try {
              json = {
                errno: 0,
                data: JSON.parse(file)
              };
            } catch (errstr) {
              json = {
                errno: 1,
                errmsg: errstr
              };
            }
            response.write(JSON.stringify(json));
          } else {
            response.write(file);
          }
          response.end();
        }
      });
    }
  });
}

function exeJs(request, response) {
  var pathname = url.parse(request.url).pathname;
  var realPath = path.join(__dirname, "json", pathname + '/' + request.method.toLocaleLowerCase() +
    '.js');
  console.log(realPath);
  fs.exists(realPath, function(exists) {
    if (!exists) {
      response.writeHead(404, { 'Content-Type': 'application/json;charset=utf-8' });
      response.write("This request URL " + pathname +
        " was not found on this server.");
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
        response.writeHead(200, { 'Content-Type': contentType });
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

var server = http.createServer(function(request, response) {
  //getJson(request, response);
  exeJs(request, response);
});

function noop(){}
process.on('uncaughtException', noop)

server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");
