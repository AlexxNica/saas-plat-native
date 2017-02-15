var fs = require('fs');
var path = require('path');
var execSync = require('child_process').execSync;

function installPackage(dir) {
  var dir = path.join(__dirname, '..', dir);
  console.log(dir)
  process.chdir(dir);
  console.log(execSync('npm', ['install']));
}

var installPackages = [
  //'',
  'dev/loaders/assets-loader',
//  'dev/plugins/babel-relative-import',
// 'src/core',
// 'src/platform/host',
// 'src/platform/login',
// 'src/platform/portal',
];

for(var i in installPackages){
  installPackage(installPackages[i]);
}
