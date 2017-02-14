/**
 * Created by albertoclarit on 11/7/15.
 */
var fs = require('fs');
var path2 = require('path');

function transformRelativeToRootPath(path, fileDir, nsRootDir, ns) {
  // 当前目录
  if (hasTildeInString(path)) {
    var withoutTilde = path.substring(2, path.length);
    var fullpath = fileDir + path2.sep + withoutTilde;
    if (withoutTilde.length < 3 || withoutTilde.substr(withoutTilde.length - 3) != '.js') {
      if (fs.existsSync(fullpath + '.js')) {
        withoutTilde += '.js';
      } else {
        if (fs.existsSync(fullpath + path2.sep + 'index.js')) {
            if (withoutTilde) withoutTilde += '/';
          withoutTilde += 'index.js';
        } else {
          console.warn(path + ' not found.');
        }
      }
    }
    return ns + '/' + withoutTilde;
  }
  // 上一级目录
  if (hasTilde2InString(path)) {
    // console.log(fileDir);
    // console.log(nsRootDir);
    var paths = ns.split('/');
    //  console.log(paths);
    var sp = path.split('../');
    var withoutTilde2 = '';
    for (var i = 0; i < sp.length; i++) {
      if (!sp[i]) {
         //console.log(sp);
        // console.log(paths);
          paths.pop();
        // console.log(paths);
      } else {
        if (withoutTilde2) withoutTilde2+='/';
        withoutTilde2+= sp[i];
      }
    }
    ns = paths.join('/');
    // console.log(ns);
    var fullpath2 = path2.normalize(path2.join(nsRootDir,ns, withoutTilde2));
    if (withoutTilde2.length < 3 || withoutTilde2.substr(withoutTilde2.length - 3) != '.js') {
      if (fs.existsSync(fullpath2 + '.js')) {
        withoutTilde2 += '.js';
      } else {
        if (fs.existsSync(fullpath2 + path2.sep + 'index.js')) {
            if (withoutTilde2) withoutTilde2 += '/';
          withoutTilde2 +='index.js';
        } else {
          console.warn(path + ' not found.');
        }
      }
    }
  //  console.log(ns + '/' + withoutTilde2);
    return ns + '/' + withoutTilde2;
  }
  // 自己引用的第三方包
  var finddir = hasDependencies(path, fileDir, nsRootDir);
  if (finddir){
    var name = path.split('/')[0];
    var withoutTilde3 = path.substring(name.length+1, path.length);
    //console.log(withoutTilde3);
    var fullpath3 = path2.join( finddir , 'node_modules' ,  name , withoutTilde3);
  // console.log( finddir  );
    if (withoutTilde3.length < 3 || withoutTilde3.substr(withoutTilde3.length - 3) != '.js') {
      if (fs.existsSync(fullpath3 + '.js')) {
        withoutTilde3 += '.js';
      } else {
        if (fs.existsSync(fullpath3 + path2.sep + 'index.js')) {
          if (withoutTilde3) withoutTilde3 += '/';
          withoutTilde3 += 'index.js';
        } else {
          console.warn(path + ' not found.');
        }
      }
    }
    return ns + '/node_modules/' + name  + '/'  + withoutTilde3;
  }
  // 系统包
  if (typeof path === 'string') {
    return path;
  }
  throw new Error('ERROR: No path passed');
}

function hasDependencies(path, dir, rootpath){
  var files = fs.readdirSync(dir);
  for(var i in files){
    var f = files[i];
    if (f.endsWith('package.json')){
      var json = JSON.parse(fs.readFileSync(path2.join(dir,f)));
      var name = path.split('/')[0];
      if (json.dependencies && json.dependencies[name]){
        return dir;
      }
      break;
    }
  }
  var parentdir = path2.dirname(path);
  if (parentdir.length>rootpath && parentdir.indexOf(rootpath)>-1){
    return hasDependencies(path, parentdir, rootpath);
  }
  return false;
}

function hasTildeInString(path) {

  var containsTilde = false;

  if (typeof path === 'string') {
    const firstTwoCharactersOfString = path.substring(0, 2);
    if (firstTwoCharactersOfString === './') {
      containsTilde = true;
    }
  }

  return containsTilde;

}

function hasTilde2InString(path) {

  var containsTilde = false;

  if (typeof path === 'string') {
    const firstTwoCharactersOfString = path.substring(0, 3);
    if (firstTwoCharactersOfString === '../') {
      containsTilde = true;
    }
  }

  return containsTilde;

}

function hasTilde3InString(path) {

  var containsTilde = false;

  if (typeof path === 'string') {
    const firstTwoCharactersOfString = path.substring(0, 2);
    if (firstTwoCharactersOfString === '~/') {
      containsTilde = true;
    }
  }

  return containsTilde;

}

module.exports = function (types) {

  return {
    visitor: {
      ImportDeclaration: function (path, state) {

        //  console.log(path);

        //var keys = Object.keys(path.node.source);

        //console.log(path.node.source.value);
        const givenPath = path.node.source.value;

        var fileDir;
        var nsRootDir;
        var ns;
        if (state && state.opts) {
          if (state.opts.file && typeof state.opts.file === 'string') {
            fileDir = path2.dirname(path2.normalize(state.opts.file));
          }
          if (state.opts.nsRootDir && typeof state.opts.nsRootDir === 'string') {
            nsRootDir = path2.normalize(state.opts.nsRootDir);
          }
          if (state.opts.ns && typeof state.opts.ns === 'string') {
            ns = state.opts.ns;
          }
        }

        if (!fileDir)
          throw 'file选项必须配置';
        if (!nsRootDir)
          throw 'nsRootDir选项必须配置';
        if (fileDir.indexOf(nsRootDir) !== 0)
          throw 'fileDir不在nsRootDir目录下';
        if (!ns)
          ns = fileDir.substr(nsRootDir.length).replace(/\\/g,'/').replace(/(^\/|\/$)/g,'');

        path.node.source.value = transformRelativeToRootPath(path.node.source.value, fileDir, nsRootDir, ns);
      }
    }
  };
};
