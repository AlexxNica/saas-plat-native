// 替换所有node_modules里面的RN类引用成RN4.0.0写法
var glob = require("glob");
var path = require("path");
var fs = require("fs");

var p = path.join(__dirname, '..', 'node_modules');
var t = path.join(__dirname, '..', 'node_modules', 'react-native', 'React');

var reactTypes = glob.sync("**/*.h", {
  cwd: t
}).map(f => {
  var sp = f.split('/');
  return sp[sp.length - 1];
});

//console.log(reactTypes);

glob.sync("**/*.{h,m}", {
  cwd: p
}).filter(f => !f.startsWith('react-native/')).forEach(f => {
  var c = fs.readFileSync(p + path.sep + f, 'utf8');
  var hs = false;
  var rs = [];
  reactTypes.forEach(rt => {
    if (c.indexOf('#import "' + rt + '"') > -1) {
      c = c.replace('#import "' + rt + '"', '#import <React/' + rt + '>');
      rs.push('#import <React/' + rt + '>');
      hs = true;
    }
  });
  if (hs) {
    //console.log(c);
    fs.writeFileSync(p + path.sep + f, c, 'utf8');
    console.log('replace file ', f);
    console.log(rs);
  }
});
