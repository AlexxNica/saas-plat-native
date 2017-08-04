var path = require('path');
var childProcess = require('child_process');
var spawnSync = childProcess.spawnSync;
var execSync = childProcess.execSync;
var fs = require('fs'),
  stat = fs.stat;

/*
 * 复制目录中的所有文件包括子目录
 * @param{ String } 需要复制的目录
 * @param{ String } 复制到指定的目录
 */
var copy = function(src, dst) {
  // 读取目录中的所有文件/目录
  fs.readdir(src, function(err, paths) {
    if (err) {
      throw err;
    }
    paths.forEach(function(path) {
      var _src = src + '/' + path,
        _dst = dst + '/' + path,
        readable,
        writable;
      stat(_src, function(err, st) {
        if (err) {
          throw err;
        }
        // 判断是否为文件
        if (st.isFile()) {
          // 创建读取流
          readable = fs.createReadStream(_src);
          // 创建写入流
          writable = fs.createWriteStream(_dst);
          // 通过管道来传输流
          readable.pipe(writable // 如果是目录则递归调用自身
          );
        } else if (st.isDirectory()) {
          exists(_src, _dst, copy);
        }
      });
    });
  });
};
// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function(src, dst, callback) {
  fs.exists(dst, function(exists) {
    // 已存在
    if (exists) {
      callback(src, dst // 不存在
      );
    } else {
      fs.mkdir(dst, function() {
        callback(src, dst);
      });
    }
  });
};

var createFolder = function(to) { //文件写入
  var sep = path.sep
  var folders = to.split(sep);
  var p = '';
  while (folders.length) {
    p += folders.shift() + sep;
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p);
    }
  }
};

var rootPath = path.dirname(__dirname);

var compile = function(s, success) {
  var config = require('../web/webpack.config');
  config.entry = config.entry || {};
  config.entry.main = path.isAbsolute(entry)
    ? entry
    : path.join(process.cwd(), entry)
  config.resolve.extensions.splice(0, 0, '.web.' + s + '.js', s + '.web.js', '.' + s + '.js');
  var webpack = require('webpack');
  config.plugins.push(new webpack.DefinePlugin({'__MOCK__': false}));
  var compiler = webpack(config);
  compiler.run((err, stats) => {
    if (err) {
      console.log(err);
    } else {
      console.log('compiled');
      success();
    }
  });
};

var outputPackage = function(type, output) {
  // 复制目录
  if (output) {
    createFolder(output);

    if (type === 'web') {
      exists(path.join(rootPath, 'web/www'), path.join(output, 'web'), copy);
    }

    if (type === 'android') {
      exists(path.join(rootPath, 'android/app/build/outputs/apk'), path.join(output, 'android'), copy);
    }
  }
};

module.exports = function({
  entry = 'index.js',
  output = 'outputs',
  web,
  android,
  ios,
  windows,
  macos,
  xxs,
  xs,
  sm,
  md,
  lg
}) {
  // 打包
  if (web) {
    console.log('编译web');
    // execSync('webpack --config ' + rootPath +   '/web/webpack.config.js
    // --progress --colors ' +   (path.isAbsolute(entry) ? entry :
    // path.join(process.cwd(), entry)), {     stdio: [0, 1, 2]   });

    xxs && compile('xxs', function() {
      outputPackage('web', output);
    });
    xs && compile('xs', function() {
      outputPackage('web', output);
    });
    sm && compile('sm', function() {
      outputPackage('web', output);
    });
    md && compile('md', function() {
      outputPackage('web', output);
    });
    lg && compile('lg', function() {
      outputPackage('web', output);
    });
  }

  if (android) {
    // node node_modules/react-native/local-cli/cli.js bundle --entry-file
    // index.android.js --bundle-output
    // ./android/app/src/main/assets/index.android.jsbundle --platform android
    // --assets-dest ../android/app/src/main/res/ --dev  false
    console.log('构建android包');
    spawnSync('node', [
      'node_modules/react-native/local-cli/cli.js',
      'bundle',
      '--entry-file',
      entry,
      '--bundle-output',
      rootPath + '/android/app/src/main/assets/index.android.jsbundle',
      '--platform',
      'android',
      '--assets-dest',
      rootPath + '/android/app/src/main/res/',
      '--dev',
      'false'
    ], {
      stdio: [0, 1, 2]
    });

    // cd android && gradlew assembleRelease
    console.log('编译android apk');
    if (process.platform === 'win32') {
      execSync('cd "' + rootPath + '/android" && gradlew assembleRelease', {
        stdio: [0, 1, 2]
      });
    } else {
      execSync('cd "' + rootPath + '/android" && ./gradlew assembleRelease', {
        stdio: [0, 1, 2]
      });
    }

    outputPackage('android', output);
  }

  if (ios) {
    console.log('构建ios包');
    spawnSync('node', [
      'node_modules/react-native/local-cli/cli.js',
      'bundle',
      '--entry-file',
      entry,
      '--bundle-output',
      rootPath + '/ios/main.jsbundle',
      '--platform',
      'ios',
      '--assets-dest',
      rootPath + '/ios/Saasplat/Images.xcassets/',
      '--dev',
      'false'
    ], {
      stdio: [0, 1, 2]
    });

    outputPackage('ios', output);
  }

  if (windows) {
    console.log('构建windows包');
    spawnSync('node', [
      'node_modules/react-native/local-cli/cli.js',
      'bundle',
      '--entry-file',
      entry,
      '--bundle-output',
      rootPath + '/windows/Saasplat/ReactAssets/index.windows.bundle',
      '--platform',
      'windows',
      '--assets-dest',
      rootPath + '/windows/Saasplat/ReactAssets',
      '--dev',
      'false'
    ], {
      stdio: [0, 1, 2]
    });

    outputPackage('windows', output);
  }

  if (macos) {
    // todo
  }

}
