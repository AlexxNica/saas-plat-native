var url = require('url');
var querystring = require('querystring');
var fs = require('fs');
var path = require('path');

exports.default = function () {

  var json2 = {
    bundleServer: 'http://test.saas-plat.com:8202/bundle/file',
    bundles: [],
    device: {
      debug: true
    }
  };
  var root = path.join(__dirname,  '../../../../src/platform');
  var files = fs.readdirSync(root);
  for (var f in files) {
    var filename = path.join(root, files[f], 'package.json');
    var packageconfig = {};
    if (fs.existsSync(filename)) {
      var packagefile = fs.readFileSync(filename);
      var json3 = JSON.parse(packagefile);
      json3.spconfig = json3.spconfig || {};
      packageconfig = {
        name: json3.name,
        version: 'HEAD',
        description: json3.description,
        keywords: json3.keywords,
        author: json3.author,
        license: json3.license,
        // 下面的是sp扩展
        preload: json3.spconfig.preload,
        dependencies: json3.spconfig.dependencies
      };
        json2.bundles.push(packageconfig);
    }

  }


 return json2;
}
