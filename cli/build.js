var program = require('commander');
var path = require('path');
var spawnSync = require('child_process').spawnSync;
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
        readable, writable;
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
          readable.pipe(writable);
        }
        // 如果是目录则递归调用自身
        else if (st.isDirectory()) {
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
      callback(src, dst);
    }
    // 不存在
    else {
      fs.mkdir(dst, function() {
        callback(src, dst);
      });
    }
  });
};

var rootPath = path.dirname(__dirname);

program.version('1.0.0');

program.command('build [entry]')
  .description('编译构建')
  .option('-o, --output <string>', '输出目录')
  .option('-w, --web', '构建web平台')
  .option('-a, --android', '构建安卓平台')
  .option('-i, --ios', '构建IOS平台')
  .option('-w, --windows', '构建Windows 10平台')
  .option('-m, --macos', '构建Mac平台')
  .action(function(entry, {
    output = 'outputs',
    web,
    android,
    ios,
    windows,
    macos
  }) {
    // 打包
    if (web) {
      console.log('编译web');
      console.log(spawnSync('webpack', [
        '--config',
        rootPath + '/web/webpack.config.js',
        '--progress',
        '--colors'
      ]).stdout.toString());
    }

    if (android) {
      // node node_modules/react-native/local-cli/cli.js bundle --entry-file index.android.js --bundle-output ./android/app/src/main/assets/index.android.jsbundle --platform android --assets-dest ../android/app/src/main/res/ --dev  false
      console.log('构建android包');
      console.log(spawnSync('node', [
        'node_modules/react-native/local-cli/cli.js',
        'bundle',
        '--entry-file',
        entry,
        '--bundle-output',
        rootPath +
        '/android/app/src/main/assets/index.android.jsbundle',
        '--platform',
        'android',
        '--assets-dest',
        rootPath + '/android/app/src/main/res/',
        '--dev',
        'false'
      ]).stdout.toString());

      // cd android && gradlew assembleRelease
      console.log('编译android apk');
      if (process.platform === 'win32') {
        console.log(spawnSync(__dirname + '/buildandroid.bat').stdout.toString());
      } else {
        console.log(spawnSync(__dirname + '/buildandroid').stdout.toString());
      }
    }
    if (ios) {
      console.log('构建ios包');
      console.log(spawnSync('node', [
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
      ]).stdout.toString());
    }

    if (windows) {
      console.log('构建windows包');
      console.log(spawnSync('node', [
        'node_modules/react-native/local-cli/cli.js',
        'bundle',
        '--entry-file',
        entry,
        '--bundle-output',
        rootPath +
        '/windows/Saasplat/ReactAssets/index.windows.bundle',
        '--platform',
        'windows',
        '--assets-dest',
        rootPath + '/windows/Saasplat/ReactAssets',
        '--dev',
        'false'
      ]).stdout.toString());
    }

    if (macos) {

    }

    // 复制目录
    if (outputs) {
      if (web) {
        exists(path.join(rootPath, 'web/www'),
          path.join(outputs, 'web'), copy);
      }

      if (android) {
        exists(path.join(rootPath, 'web/android/app/build/outputs/apk'),
          path.join(outputs, 'android'), copy);
      }
    }
  });

program.parse(process.argv); //开始解析用户输入的命令
