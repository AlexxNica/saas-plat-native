var path = require('path');

var bundles = {
  fs: require('fs')
};
exports.bundles = bundles;

function bigThen(ver1, ver2) {
  for (var i = 0; i < ver1.length || i < ver2.length; i++) {
    if (parseInt(ver1[i] || 0) > parseInt(ver2[i] || 0)) return true;
  }
  return false;
}

function getdeps(name, platform, version, dev, ext) {
  if (version == 'HEAD' || !version) {
    var ps = name.split('/');
    var filename = ps[ps.length - 1];
    var p = [__dirname, 'bundles'];
    var maxVer = [1,0,0];
    if (ps.length > 1) p = p.concat(ps.slice(0, ps.length - 1));
    //console.log(p);
    var dirs = bundles.fs.readdirSync(p.join(path.sep));
    for (var i = 0; i < dirs.length; i++) {
      if (dirs[i].startsWith(name + '.' + (platform || 'ios') + '-') && dirs[i].endsWith('.js')) {
        var verjs = dirs[i].substr((name + '.' + (platform || 'ios') + '-').length);
        var ver = verjs.substr(0, verjs.length - 3).split('.');
        if (!maxVer || bigThen(ver, maxVer)) {
          maxVer = ver;
        }
      }
    }
    //console.log(maxVer);
    version = maxVer.join('.');
  }
  var file = path.join(__dirname, 'bundles', name + '.' + (platform || 'ios') + '-' + version + ext);
  if (!bundles.fs.existsSync(file)) {
    console.log('bundle ' + file + ' not found.');
    return '';
  }
  var fileContent = bundles.fs.readFileSync(file);
  // console.log(fileContent.toString());
  var bundle = fileContent.toString();
  // if (dev) {
  //   bundle += '//# sourceMappingURL=http://test.saas-plat.com:3000/bundle/map?name=' + name + '&platform=' + platform + '&version=' + version + '&dev=' + dev;
  // }

  return bundle;
}

exports.get = function (name, platform, version, dev) {
  return getdeps(name, platform, version, dev, '.js');
};

exports.map = function (name, platform, version, dev) {
  return getdeps(name, platform, version, dev, '.js.map');
};
