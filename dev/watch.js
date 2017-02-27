var fs = require('fs');
var path = require('path');
var webpackAndroid = require('./webpack')();
var webpackIOS = require('./webpack')();

var needrepack;
var isrepack;

webpackAndroid.setPlatform('android');
webpackIOS.setPlatform('ios');

function repackTimer() {
  if (needrepack && !isrepack) {
    needrepack = false;
    isrepack = true;
    webpackIOS.close(function(){
      //webpackAndroid.close(function () {
        if (!needrepack){
          //webpackAndroid.run();
          webpackIOS.run();
        }
        isrepack = false;
      //});
    });
  }
  setTimeout(function () {
    repackTimer();
  }, 1000);
}

function repack() {
  needrepack = true;
}

function watchdir(dir, watchchild) {
  fs.watch(dir, function (e, name) {
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

repackTimer();
webpackAndroid.run();
webpackIOS.run();

// 有新bundle重新webpack打包watch
// var dirs = fs.readdirSync(config.BUNDLE_SRC);
// for (var i in dirs) {
//   watchdir(path.join(config.BUNDLE_SRC, dirs[i]), true);
// }
