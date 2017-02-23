var fs = require('fs');
var path = require('path');
var config = require('../../../config').get();

function deleteCodeComments(code) {
  // 另一种思路更简便的办法
   // 将'://'全部替换为特殊字符，删除注释代码后再将其恢复回来
   var tmp1 = ':\/\/';
   var regTmp1 = /:\/\//g;
   var tmp2 = '@:@/@/@';
   var regTmp2 = /@:@\/@\/@/g;
   code = code.replace(regTmp1, tmp2);
   var reg = /(\/\/.*)?|(\/\*[\s\S]*?\*\/)/g;
   code = code.replace(reg, '');
   result = code.replace(regTmp2, tmp1);
   return result;
}

function readJsonFile(filename) {
  var json3 = {};
  if (fs.existsSync(filename)) {
    // console.log(filename);
     
    console.log(fs.readFileSync(filename, 'utf8'));
    var packagefile = fs.readFileSync(filename, 'utf8');
    packagefile = deleteCodeComments(packagefile);
    json3 = JSON.parse(packagefile);

  }
  return json3;
}

function findAppBundle(json2, dir) {
  if (dir === 'core' || dir === 'platform')
    return;
  var root = config.BUNDLE_SRC + path.sep + dir;
  var files = fs.readdirSync(root);
  for (var f in files) {
    if (files[f] === 'core') {
      continue;
    }
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
      json2.bundles.push(Object.assign({}, packageconfig, {
        name: (dir && (dir.replace(/\\/g, '/') + '/')) + files[f]
      }));
    }
  }

  for (var f in files) {
    if (files[f] !== 'node_modules') {
      if (fs.statSync(path.join(root, files[f])).isDirectory()) {
        findAppBundle(json2, (dir && (dir + path.sep)) + files[f]);
      }
    }
  }
}

exports.default = function() {
  var json2 = {
    id: 'server1',
    name: '测试服务器1',
    address: 'http://test.saas-plat.com:8202/server1',
    bundleServer: 'http://test.saas-plat.com:8202/bundle/file',
    bundles: []
  };
  findAppBundle(json2, '');
  var moduleFileName = path.join(__dirname, 'department', 'module.json');
  var json4 = readJsonFile(moduleFileName);
  var views = [];
  for (i = 0; i < json4.adapter[0].views.length; i++) {
    var vp = json4.adapter[0].views[i];
    var v = readJsonFile(path.join(__dirname, 'department', 'views', vp + '.json'));
    views.push(v);
  }
  json2.modules = [
    {
      id: new Date().getTime(),
      code: json4.code,
      name: json4.name,
      description: json4.description,
      views: views
    }
  ];

  return json2;
}
