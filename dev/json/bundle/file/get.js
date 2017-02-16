var url = require('url');
var querystring = require('querystring');
var bundles = require('./bundles');

exports.custom = function(request, response) {
  var theurl = url.parse(request.url);
  console.log('download js file ' + theurl.query);
  var qs = querystring.parse(theurl.query);
  var js = bundles.get(qs.name, qs.platform || 'ios', qs.version || 'HEAD', qs.dev);
  response.writeHead(200, { 'Content-Type': 'text/javascript;charset=utf-8' });
  response.write(js);
  response.end();
}
