var fs = require('fs');
var path = require('path');
var npm = require('npm');
// var execSync = require('child_process').execSync;

function installPackage(dir, cb) {
  if (!dir) return;
  dir = path.resolve(path.join(__dirname, dir));
  console.log('install ' + dir);
  process.chdir(dir);
  // console.log(execSync('npm', ['install']));
  npm.load({
    // loglevel: "debug",
    // verbose: true
  }, function(er, npm) {
    if (er) return cb(er);
    var packfile = path.join(dir, 'package.json');
    var args = [];
    if (fs.existsSync(packfile)) {
      var userPackage = JSON.parse(fs.readFileSync(packfile) || '{}');
      if (userPackage.dependencies) {
        for (var name in userPackage.dependencies) {
          args.push(name + '@' + userPackage.dependencies[name]);
          //args.push(name);
        }
      }
      if (userPackage.devDependencies) {
        for (var name in userPackage.devDependencies) {
          args.push(name + '@' + userPackage.devDependencies[name]);
          //args.push(name);
        }
      }
    }
    console.log(args);
    npm.commands.install(dir, args, cb);
  });
}

var installPackages = [
  './loaders/assets-loader',
  './plugins/babel-relative-import',
];

//installPackages = installPackages.concat(require('./apps').apps);

function installAll(id) {
  installPackage(installPackages[id || 0], function(err) {
    if (err) {
      console.log(err);
      return;
    }
    installAll((id || 0) + 1);
  });
}

installAll();
