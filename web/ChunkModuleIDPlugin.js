// ********************************
//     平台模块id的hash化
//     支持独立文件更新部署
// ********************************

var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var url = require('url');

var dirname = path.dirname(__dirname);

function ChunkModuleIDPlugin(options) {
  // Configure your plugin with options...
}

function md5file(path) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(path.substr(dirname.length + 1-5));
  return md5sum.digest('hex');
  // if (path.startsWith(dirname))
  //   return path.substring(dirname.length + 1).replace(/[\/\\]/gi,'_');
  // else {
  //   return path;
  // }
}

ChunkModuleIDPlugin.prototype.apply = function (compiler) {
  compiler.plugin("compilation", function (compilation) {
    compilation.plugin("optimize-chunks", function (chunks) {
      var cid = 0,
        mid = 0;
      chunks.forEach(function (chunk) {
        //chunks have circular references to their modules
        mid = cid;
        chunk.modules.forEach(function (module) {
          if (module.chunks.filter(function (t) {
              return t.optimizeChunkModuleID;
            }).length > 0) {
            return;
          }
          if (module.userRequest && (
              module.userRequest.startsWith(dirname) ||
              module.userRequest.startsWith('./~/')
            )) {
            var a = url.parse(module.userRequest);
            var path = a.protocol + a.pathname;
            module.id = md5file(path);
          }
        });
        chunk.optimizeChunkModuleID = true;
        cid = cid + 1000;
      });
    });
  });
};

module.exports = ChunkModuleIDPlugin;
