var webpack = require('webpack');
var MemoryFS = require("memory-fs");
var path = require('path');
var fs = require('fs');
var config = require('./config').get();
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

module.exports = function() {

  var watcher;
  var platform = 'ios';
  var mainfile = 'index.js';
  var packagefile = 'package.json';

  function findEntry(list, searchDir) {
    if (!fs.statSync(searchDir).isDirectory())
      return;
    var dirs = fs.readdirSync(searchDir);
    for (var i in dirs) {
      var dir = dirs[i];
      var packagefilename = path.join(searchDir, dir, packagefile);
      if (!fs.existsSync(packagefilename)) {
        findEntry(list, path.join(searchDir, dir));
      } else {
        list.push(path.join(searchDir, dir));
      }
    }
  }

  function getEntry(list) {
    var entry = {};
    for (var i in list) {
      var dir = list[i];
      var mainfullfilename = path.join(dir, mainfile);
      var packagefilename = path.join(dir, packagefile);
      //console.log(packagefilename);
      if (fs.existsSync(packagefilename)) {
        var packagejson2 = JSON.parse(fs.readFileSync(packagefilename));
        if (fs.existsSync(mainfullfilename)) {
          entry[packagejson2.name + '.' + platform + '-' + packagejson2.version || '1.0.0'] = mainfullfilename;
        } else {
          mainfullfilename = path.join(dir, 'src', mainfile);
          if (fs.existsSync(mainfullfilename)) {
            entry[packagejson2.name + '.' + platform + '-' + packagejson2.version || '1.0.0'] = mainfullfilename;
          }
        }
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
      var file = fs.readFileSync(path.join(path.dirname(__dirname), 'package.json'));
      var packagejson = JSON.parse(file);
      var externals = ['saasplat-native'];
      for (var k in packagejson.dependencies) {
        externals.push(k);
        externals.push(new RegExp('^' + k + '/'));
      }
      //  console.log(externals);

      var list = [];
      findEntry(list, path.join(__dirname, '../src'));
      list = list.concat(config.bundles);
      var entry = getEntry(list);
      // console.log(list);
      console.log(entry);

      // returns a Compiler instance
      var compiler = webpack({
        entry: entry,
        output: {
          library: 'lib',
          libraryTarget: 'commonjs2',
          path: path.join(__dirname, 'bundles'),
          filename: '[name].js'
        },
        externals: externals,
        resolve: {
          extensions: [
            '', '.js', '.' + platform + '.js',
            '.png',
            '.jpg'
          ]
        },
        devtool: '#source-map', // inline-source-map
        node: {
          fs: 'empty'
        },
        module: {
          loaders: [
            {
              test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$|\.(eot?|woff?|woff2?|ttf?|svg?|png?|jpg?|gif?)/,
              loader: path.join(__dirname, 'loaders', 'assets-loader'),
              query:{
                limit:8192,
                name:'[name].[hash:6].[ext]',
                publicPath:'http://assets.saas-plat.com/[path]',
                outputPath: path.join(__dirname, 'bundles', 'assets', '[path]')
              }
            }, {
              test: /\.js$/,
              //exclude: new RegExp('^'+config.BUNDLE_SRC),
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
                  // fi,   "nsRootDir": __dirname + '\\..\\bundles\\' }]
                  'transform-runtime'
                ]
              }
            }
          ]
        },
        //其它解决方案配置
        resolve: {
          extensions: platform == 'web'
            ? [
              '', '.js', '.' + platform + '.js'
            ]
            : null,
          alias: platform == 'web'
            ? {
              'react-native': 'react-native-web'
            }
            : null
        }
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
        if (jsonStats.errors.length > 0 || jsonStats.warnings.length > 0) {
          for (var i in jsonStats.errors) {
            console.log(jsonStats.errors[i] + ' error'.error);
          }

          for (var k in jsonStats.warnings) {
            console.log(jsonStats.warnings[k] + ''.warn);
          }
          console.log('-------- ' + new Date().toLocaleString().info + ' -------');
        } else {
          console.log('webpack complate'.info);
        }
      });

      console.log(platform + ' webpack compiler run'.info);
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
