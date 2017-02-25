var fs = require('fs');
var path = require('path');
var npm = require('npm');
// var execSync = require('child_process').execSync;

function installPackage(dir, cb) {
  if (!dir) return;
  dir = path.join(__dirname, '..', dir);
  console.log(dir);
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
    }
    console.log(args);
    npm.commands.install(dir, args, cb);
  });
}

var installPackages = [
  'dev/loaders/assets-loader',
  'dev/plugins/babel-relative-import',
  'src/core',
  'src/platform/host',
  'src/platform/login',
  'src/platform/portal'
];

function installAll(id) {
  installPackage(installPackages[id || 0], function(err) {
    if (err){
      console.log(err);
      return;
    }
    installAll((id || 0) + 1);
  });
}

installAll();
