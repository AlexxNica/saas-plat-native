// 根据package.json生成spdefine.js

var glob = require("glob");
var path = require("path");
var fs = require("fs");

var content = [];

const writeSpdefine = (key, version) => {
  if (key == 'jcore-react-native'
||  key == "react-native-web"
||  key == "antd"
||  key ==  "react-native-windows" ){
    return;
  }
  if (key == 'mobx-react') {
    key += '/native';
  }
  var str = `spdefine('${key}', function (global, require, module, exports) {
  module.exports = require('${key}');
  module.exports.version = '${version}';
});`
  if (key == 'react-native') {
    // 这几个比较特别也需要引用
    writeSpdefine('react-native/Libraries/ReactNative/YellowBox', version);
    writeSpdefine('react-native/Libraries/EventEmitter/EventEmitter', version);
    writeSpdefine('react-native/Libraries/Utilities/stringifySafe', version);
    writeSpdefine('react-native/Libraries/Renderer/src/renderers/native/ReactNativePropRegistry', version);
  }
  if (key == 'react-native-vector-icons') {
    writeSpdefine('react-native-vector-icons/Entypo', version);
    writeSpdefine('react-native-vector-icons/EvilIcons', version);
    writeSpdefine('react-native-vector-icons/FontAwesome', version);
    writeSpdefine('react-native-vector-icons/Foundation', version);
    writeSpdefine('react-native-vector-icons/Ionicons', version);
    writeSpdefine('react-native-vector-icons/MaterialIcons', version);
    writeSpdefine('react-native-vector-icons/Octicons', version);
    writeSpdefine('react-native-vector-icons/Zocial', version);
    writeSpdefine('react-native-vector-icons/SimpleLineIcons', version);
  }
  content.push(str);
}

const getCurrentVersion = (name) => {
  return JSON.parse(fs.readFileSync(__dirname + '/../node_modules/' + name + '/package.json')).version;
}

var dependencies = JSON.parse(fs.readFileSync(__dirname + '/../package.json')).dependencies;

for (var p in dependencies) {
  writeSpdefine(p, getCurrentVersion(p));
}

fs.writeFileSync(__dirname + '/../bundles.ios.js', content.join('\n'));
fs.writeFileSync(__dirname + '/../bundles.android.js', content.join('\n'));
//fs.writeFileSync(__dirname + '/../bundles.windows.js', content.join('\n'));
//fs.writeFileSync(__dirname + '/../bundles.web.js', content.join('\n'));
