var url = require('url');
var querystring = require('querystring');
var bundles = require('./bundles');

exports.custom = function(request, response) {
  var theurl = url.parse(request.url);
  console.log('download map file ' + theurl.query);
  var qs2 = querystring.parse(theurl.query);
  var json = bundles.map(qs2.name, qs2.platform, qs2.version, qs2.dev);
  response.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
  response.write(json);
  response.end();
}
