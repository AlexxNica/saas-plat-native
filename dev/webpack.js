var webpack = require('webpack');
var MemoryFS = require("memory-fs");
var path = require('path');
var fs = require('fs');
var bundles = require('./bundles').bundles;

var colors = require('colors');
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'red',
  info: 'green',
  data: 'blue',
  help: 'cyan',
  warn: 'yellow',
  debug: 'magenta',
  error: 'red'
});

module.exports.createBuilder = function() {

  var watcher;
  var platform = 'ios';
  var mainfile = 'index.js';
  var packagefile = 'package.json';

  function findEntry(list, searchDir) {
    if (!fs.statSync(searchDir).isDirectory()) {
      return;
    }
    var dirs = fs.readdirSync(searchDir);
    for (var i = 0; i < dirs.length; i++) {
      var dir = dirs[i];
      var packagefilename = path.join(searchDir, dir, packagefile);
      if (!fs.existsSync(packagefilename)) {
        findEntry(list, path.join(searchDir, dir));
      } else {
        var packagejson2 = JSON.parse(fs.readFileSync(packagefilename));
        if (list.indexOf(path.normalize(path.join(searchDir, dir))) === -1 &&
          packagejson2.spconfig && (packagejson2.spconfig.scope === 'client' ||
            packagejson2.spconfig.scope === 'native')) {
          list.push(path.join(searchDir, dir));
        }
      }
    }
  }

  function getEntry(list) {
    var entry = {};
    for (var i = 0; i < list.length; i++) {
      var dir = list[i];
      var packagefilename = path.join(dir, packagefile);
      //console.log(packagefilename);
      if (fs.existsSync(packagefilename)) {
        try {
          var packagejson2 = JSON.parse(fs.readFileSync(packagefilename));
          var mainfullfilename = path.join(dir, packagejson2.main || mainfile);
          if (fs.existsSync(mainfullfilename)) {
            entry[packagejson2.name + '.' + platform + '-' + packagejson2.version ||
              '1.0.0'] = mainfullfilename;
          } else {
            mainfullfilename = path.join(dir, 'src', mainfile);
            if (fs.existsSync(mainfullfilename)) {
              entry[packagejson2.name + '.' + platform + '-' + packagejson2.version ||
                '1.0.0'] = mainfullfilename;
            } else {
              console.warn('入口文件不存在', mainfullfilename);
            }
          }
        } catch (err) {
          console.warn('包不错误', packagefilename);
        }
      } else {
        console.warn('包不存在', packagefilename);
      }
    }
    return entry;
  }

  return {
    setPlatform: function(plat) {
      platform = plat;
    },

    run: function() {
      // externals
      var file = fs.readFileSync(path.join(path.dirname(__dirname),
        'package.json'));
      var packagejson = JSON.parse(file);
      var externals = ['saasplat-native'];
      for (var k in packagejson.dependencies) {
        externals.push(k);
        externals.push(new RegExp('^' + k + '/'));
      }
      //  console.log(externals);

      var list = [];
      list = list.concat((require('./apps').apps || []).map(item => path.isAbsolute(
        item) ? item : path.join(__dirname, item)));
      //findEntry(list, path.join(process.cwd(), 'node_modules'));
      findEntry(list, path.join(__dirname, '../node_modules'));
      // console.log(list)
      list = list.map(item => path.normalize(item));
      var entry = getEntry(list);
      var alias = {
        "saasplat-native": "saas-plat-native-core"
      };
      platform === 'web' && (alias['react-native'] = 'react-native-web' );
      // console.log(list);
     console.log(entry);
      // returns a Compiler instance
      var compiler = webpack({
        entry: entry,
        output: {
          library: 'lib',
          libraryTarget: 'commonjs2',
          path: path.join(process.cwd(), 'bundles'),
          filename: '[name].js'
        },
        externals: externals,
        devtool: '#cheap-module-eval-source-map', //'#cheap-module-source-map',
        node: {
          fs: 'empty',
          // global: true, Buffer: true, console: true
        },
        module: {
          loaders: [{
            test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$|\.(eot?|woff?|woff2?|ttf?|svg?|png?|jpg?|gif?)/,
            loader: path.join(__dirname, 'loaders', 'assets-loader'),
            query: {
              limit: 8192,
              name: 'assets/[name].[hash:6].[ext]',
              //publicPath: 'http://app.saas-plat.com/'
              publicPath: 'http://localhost:8200/'
            }
          }, {
            test: /\.js$/,
            //exclude: /node_modules/,
            loader: 'babel',
            query: {
              sourceMaps: 'yes',
              //sourceRoot: config.BUNDLE_SRC,
              presets: [
                "es2015",
                "es2017",
                "stage-0",
                "stage-1",
                "stage-2",
                "stage-3",
                "react"
              ],
              plugins: [
                'transform-decorators-legacy',
                // [path.normalize(__dirname + "\\plugins\\babel-relative-import"), {   "file":
                // fi,   "nsRootDir": __dirname + '\\..\\bundles\\' }] 'transform-runtime'
              ]
            }
          }]
        },
        //其它解决方案配置
        resolve: {
          extensions: [
            '',
            '.' + platform + '.js',
            '.js',
            '.png',
            '.jpg'
          ],
          alias: alias
        },
        plugins: [{
          apply: function(compiler) {
            compiler.plugin("compile", function(params) {
              console.log(
                "The compiler is starting to compile...");
            });
          }
        }]
      });

      // 不输出文件 bundles.fs = compiler.outputFileSystem = new MemoryFS();

      watcher = compiler.watch({ // watch options:
        aggregateTimeout: 300, // wait so long for more changes
        poll: true // use polling instead of native watchers
        // pass a number to set the polling interval
      }, function(err, stats) {
        if (err) {
          console.log(err + ' error'.error);
          return;
        }

        var jsonStats = stats.toJson();
        if (jsonStats.errors.length > 0 || jsonStats.warnings.length >
          0) {
          for (var i in jsonStats.errors) {
            console.log(jsonStats.errors[i] + ' error'.error);
          }

          for (var k in jsonStats.warnings) {
            console.log(jsonStats.warnings[k] + ''.warn);
          }
          console.log('-------- ' + new Date().toLocaleString().info +
            ' -------');
        } else {
          console.log('webpack built src complate'.info);
        }
      });

    },

    close: function(cb) {
      if (watcher) {
        watcher.close(cb);
        watcher = null;
      } else if (typeof cb === 'function') {
        cb();
      }
    }
  };
};
