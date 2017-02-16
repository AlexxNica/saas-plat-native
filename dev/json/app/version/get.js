var fs = require('fs');
var path = require('path');

exports.default = function() {

  var filename3 = path.join(__dirname, '../../../../package.json');
  var json3 = {
    version: '1.0.0'
  };
  if (fs.existsSync(filename3)) {
    var packagefile2 = fs.readFileSync(filename3);
    json3 = JSON.parse(packagefile2);
  }
  return {
    "name": json3.name,
    "version": 'HEAD', // 每次取最新版本
    "description": json3.description
  };
};
