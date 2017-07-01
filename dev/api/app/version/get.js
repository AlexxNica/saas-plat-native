var fs = require('fs');
var path = require('path');
var url = require('url');
var querystring = require('querystring');

exports.default = function(request) {
  var theurl = url.parse(request.url);
  var q = querystring.parse(theurl.query);
  var filename3 = path.join(__dirname, '../../../../package.json');
  var json3 = {
    version: '1.0.0'
  };
  if (fs.existsSync(filename3)) {
    var packagefile2 = fs.readFileSync(filename3);
    json3 = JSON.parse(packagefile2);
  }
  return {
    name: json3.name,
    version: 'HEAD', // 每次取最新版本
    file: `http://localhost:8200/api/v1/bundle/file?core.${q.platform || 'web'}-HEAD.js`,
    description: json3.description
  };
};
