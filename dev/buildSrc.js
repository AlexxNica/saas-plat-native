var fs = require('fs');
var path = require('path');
var webpack = require('./webpack')();

var needrepack;
var isrepack;

var arguments = process.argv.splice(2);

if (arguments.indexOf('--android') > -1 ) {
  webpack.setPlatform('android');
}
if (arguments.indexOf('--ios') > -1) {
  webpack.setPlatform('ios');
}
if (arguments.indexOf('--web') > -1) {
  webpack.setPlatform('web');
}
if (arguments.indexOf('--windows') > -1) {
  webpack.setPlatform('windows');
}
if (arguments.indexOf('--macos') > -1) {
  webpack.setPlatform('macos');
}

function repackTimer() {
  if (needrepack && !isrepack) {
    needrepack = false;
    isrepack = true;
    webpack.close(function() {
      if (!needrepack) {
        webpack.run();
      }
      isrepack = false;
    });
  }
  setTimeout(function() {
    repackTimer();
  }, 1000);
}

function repack() {
  needrepack = true;
}

function watchdir(dir, watchchild) {
  fs.watch(dir, function(e, name) {
    var targetfile = path.join(dir, name);
    if (e === 'rename') {
      if (fs.existsSync(targetfile)) {
        // 新建
        var stat = fs.statSync(targetfile);
        if (stat.isDirectory()) {
          if (watchchild)
            watchdir(targetfile, false);
          if (fs.existsSync(path.join(targetfile, 'index.js'))) {
            repack();
          }
        } else if (stat.isFile() && name == 'index.js') {
          repack();
        }
      } else if (watchchild) {
        repack();
      }
    }
  });
}
if (arguments.indexOf('--watch') > -1) {
  repackTimer();
}

webpack.run();

// 有新bundle重新webpack打包watch var dirs = fs.readdirSync(config.BUNDLE_SRC); for
// (var i in dirs) {   watchdir(path.join(config.BUNDLE_SRC, dirs[i]), true); }
