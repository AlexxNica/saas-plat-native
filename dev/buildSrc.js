var fs = require('fs');
var path = require('path');
var webpack = require('./webpack');

var needrepack;
var isrepack;

var arguments = process.argv.splice(2);

var builders = [];
if (arguments.indexOf('--android') > -1) {
  var builder = webpack.createBuilder();
  builder.setPlatform('android');
  builders.push(builder);
}
if (arguments.indexOf('--ios') > -1) {
  var builder = webpack.createBuilder();
  builder.setPlatform('ios');
  builders.push(builder);
}
if (arguments.indexOf('--web') > -1) {
  var builder = webpack.createBuilder();
  builder.setPlatform('web');
  builders.push(builder);
}
if (arguments.indexOf('--windows') > -1) {
  var builder = webpack.createBuilder();
  builder.setPlatform('windows');
  builders.push(builder);
}
if (arguments.indexOf('--macos') > -1) {
  var builder = webpack.createBuilder();
  builder.setPlatform('macos');
  builder.run();
}

function build() {
  for (var i in builders) {
    builders[i].run();
  }
}

var needCloses;

function closebuild(cb) {
  needCloses = builders.length;
  for (var i in builders) {
    builders[i].close(function() {
      needCloses--;
      if (needCloses <= 0) {
        cb();
      }
    });
  }
}

function repackTimer() {
  if (needrepack && !isrepack) {
    needrepack = false;
    isrepack = true;
    closebuild(function() {
      if (!needrepack) {
        build();
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
  build();
  //repackTimer();
  // 有新bundle重新webpack打包  watch
  // var dirs = fs.readdirSync(config.BUNDLE_SRC);
  // for (var i in dirs) {
  //   watchdir(path.join(config.BUNDLE_SRC, dirs[i]), true);
  // }
} else {
  build();
}
