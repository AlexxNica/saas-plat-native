var loaderUtils = require("loader-utils");
var mime = require("mime");
var images = require("images");
var path = require('path');
var fs = require('fs');
var urlLoader = require("url-loader");

module.exports = function(content) {
  this.cacheable && this.cacheable();
  var extname = path.extname(this.resourcePath);
  //console.log(this.resourcePath);
    // 图片打包时对平台和精度有待进行支持 例如my-icon.ios.png和my-icon.android.png iPhone
    // 5s会使用check@2x.png，而Nexus 5上则会使用check@3x.png
  // console.log(extname);
  if (['.png', '.jpg', '.gif'].indexOf(extname) > -1) {
    var assets = [];
    var parentdir = path.dirname(this.resourcePath);
    var filename = this.resourcePath.substr(parentdir.length + 1, this.resourcePath.length - parentdir.length - extname.length - 1);
    var files = fs.readdirSync(parentdir);
    // console.log(filename);
    for (var i in files) {
      if (files[i].startsWith(filename) && files[i].endsWith(extname)) {
        var fis = files[i].split('.');
        var name = fis.length > 2
          ? fis[fis.length - 3]
          : fis[fis.length - 2];
        var ns = name.split('@');
        var scale = 1;
        if (ns.length > 1 && (ns[ns.length - 1].endsWith('X') || ns[ns.length - 1].endsWith('x'))) {
          var s = ns[ns.length - 1].substr(0, ns[ns.length - 1].length - 1);
          scale = s.replace(/_/g, '.');
        }
        var img = images(content);
        var data = urlLoader.call(this, content).replace('module.exports = ', '');
        assets.push({
          name: ns[0],
          platform: fis.length > 2
            ? fis[fis.length - 2]
            : null,
          scale: scale, //default
          source: {
            uri: data.substr(1, data.length-2),
            width: img.width(),
            height: img.height()
          }
        });
        //console.log(assets);
      }
    }
    //console.log(assets);
    if (assets.length <= 0)
      throw this.resourcePath + ' 未能正确加载';
    return "module.exports = require('saasplat-native').Asset.registerAssets(" + JSON.stringify(assets) + ");";
  } else {
    //console.log(urlLoader.call(this, content));
    return urlLoader.call(this, content);
  }
};
module.exports.raw = true;
