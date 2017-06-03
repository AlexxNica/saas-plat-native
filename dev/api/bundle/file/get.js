var url = require('url');
var querystring = require('querystring');
var bundles = require('../../../bundles');

exports.custom = function(request, response) {
  var theurl = url.parse(request.url);
  console.log('download js file ' + theurl.query);
  var qs = theurl.query.split('.');
  var pv = qs[1]
    ? qs[1].split('-')
    : [];
  var js = bundles.get(qs[0], pv[0] || 'ios', pv[1] || 'HEAD', qs.dev);
  response.writeHead(200, {'Content-Type': 'text/javascript;charset=utf-8'});
  response.write(js);
  response.end();
};
