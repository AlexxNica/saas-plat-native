function registerFont(fontfile){
  // generate required css
  var fontfileIcons = require("react-native-vector-icons/Fonts/"+fontfile+".ttf");
  const reactNativeVectorIconsRequiredStyles = "@font-face { src:url(" +
    fontfileIcons + ");font-family: "+fontfile+"; }"

  // create stylesheet
  const style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet) {
    style.styleSheet.cssText = reactNativeVectorIconsRequiredStyles;
  } else {
    style.appendChild(document.createTextNode(
      reactNativeVectorIconsRequiredStyles));
  }

  // inject stylesheet
  document.head.appendChild(style);
}

spdefine('nprogress', function (global, __require, module, exports) {
  module.exports = require('nprogress');
  module.exports.version = '0.2.0';
});

spdefine('query-string', function (global, __require, module, exports) {
  module.exports = require('query-string');
  module.exports.version = '4.3.4';
});

spdefine('@shoutem/theme', function (global, __require, module, exports) {
  module.exports = require('@shoutem/theme');
  module.exports.version = '0.8.10';
});

spdefine('assert', function (global, __require, module, exports) {
  module.exports = require('assert');
  module.exports.version = '1.4.1';
});
spdefine('core-decorators', function (global, __require, module, exports) {
  module.exports = require('core-decorators');
  module.exports.version = '0.15.0';
});
spdefine('hoist-non-react-statics', function (global, __require, module, exports) {
  module.exports = require('hoist-non-react-statics');
  module.exports.version = '1.2.0';
});
spdefine('i18next', function (global, __require, module, exports) {
  module.exports = require('i18next');
  module.exports.version = '4.2.0';
});
spdefine('i18next-browser-languagedetector', function (global, __require, module, exports) {
  module.exports = require('i18next-browser-languagedetector');
  module.exports.version = '1.0.1';
});

spdefine('react-native-vector-icons/Entypo', function (global, require, module, exports) {
  registerFont('Entypo');
  module.exports = require('react-native-vector-icons/Entypo');
  module.exports.version = '4.0.0';
});
spdefine('react-native-vector-icons/EvilIcons', function (global, require, module, exports) {
  registerFont('EvilIcons');
  module.exports = require('react-native-vector-icons/EvilIcons');
  module.exports.version = '4.0.0';
});
spdefine('react-native-vector-icons/FontAwesome', function (global, require, module, exports) {
  registerFont('FontAwesome');
  module.exports = require('react-native-vector-icons/FontAwesome');
  module.exports.version = '4.0.0';
});
spdefine('react-native-vector-icons/Foundation', function (global, require, module, exports) {
  registerFont('Foundation');
  module.exports = require('react-native-vector-icons/Foundation');
  module.exports.version = '4.0.0';
});
spdefine('react-native-vector-icons/Ionicons', function (global, require, module, exports) {
  registerFont('Ionicons');
  module.exports = require('react-native-vector-icons/Ionicons');
  module.exports.version = '4.0.0';
});
spdefine('react-native-vector-icons/MaterialIcons', function (global, require, module, exports) {
  registerFont('MaterialIcons');
  module.exports = require('react-native-vector-icons/MaterialIcons');
  module.exports.version = '4.0.0';
});
spdefine('react-native-vector-icons/Octicons', function (global, require, module, exports) {
  registerFont('Octicons');
  module.exports = require('react-native-vector-icons/Octicons');
  module.exports.version = '4.0.0';
});
spdefine('react-native-vector-icons/Zocial', function (global, require, module, exports) {
  registerFont('Zocial');
  module.exports = require('react-native-vector-icons/Zocial');
  module.exports.version = '4.0.0';
});
spdefine('react-native-vector-icons/SimpleLineIcons', function (global, require, module, exports) {
  registerFont('SimpleLineIcons');
  module.exports = require('react-native-vector-icons/SimpleLineIcons');
  module.exports.version = '4.0.0';
});
spdefine('react-native-vector-icons', function (global, require, module, exports) {
  module.exports = require('react-native-vector-icons');
  module.exports.version = '4.0.0';
});socket.io-client
spdefine('socket.io-client', function (global, require, module, exports) {
  module.exports = require('socket.io-client');
  module.exports.version = '1.7.3';
});
spdefine('immutable', function (global, __require, module, exports) {
  module.exports = require('immutable');
  module.exports.version = '3.8.1';
});

spdefine('lodash', function (global, __require, module, exports) {
  module.exports = require('lodash');
  module.exports.version = '4.17.4';
});
spdefine('lzwcompress', function (global, __require, module, exports) {
  module.exports = require('lzwcompress');
  module.exports.version = '0.2.4';
});
spdefine('mobx', function (global, __require, module, exports) {
  module.exports = require('mobx');
  module.exports.version = '3.1.0';
});
spdefine('mobx-react', function (global, __require, module, exports) {
  module.exports = require('mobx-react');
  module.exports.version = '4.1.0';
});
spdefine('react', function (global, __require, module, exports) {
  module.exports = require('react');
  module.exports.version = '15.4.2';
});
spdefine('prop-types', function (global, __require, module, exports) {
  module.exports = require('prop-types');
  module.exports.version = '15.5.2';
});
spdefine('react-i18next', function (global, __require, module, exports) {
  module.exports = require('react-i18next');
  module.exports.version = '2.2.0';
});


spdefine('react-native-storage', function (global, __require, module, exports) {
  module.exports = require('react-native-storage');
  module.exports.version = '0.1.5';
});

spdefine('react-native-zip-archive', function (global, __require, module, exports) {
  module.exports = require('react-native-zip-archive');
  module.exports.version = '0.0.11';
});
spdefine('slash', function (global, __require, module, exports) {
  module.exports = require('slash');
  module.exports.version = '1.0.0';
});

spdefine('react-native', function (global, __require, module, exports) {
  module.exports = require('react-native-web');
  module.exports.version = '0.0.75';
});

spdefine('react-dom', function (global, __require, module, exports) {
  module.exports = require('react-dom');
  module.exports.version = '15.4.2';
});

spdefine('react-router', function (global, __require, module, exports) {
  module.exports = require('react-router');
  module.exports.version = '4.1.1';
});
spdefine('react-router', function (global, __require, module, exports) {
  module.exports = require('react-router');
  module.exports.version = '4.1.1';
});
spdefine('react-router/matchPath', function (global, __require, module, exports) {
  module.exports = require('react-router/matchPath');
  module.exports.version = '4.1.1';
});

spdefine('react-router-dom', function (global, __require, module, exports) {
  module.exports = require('react-router-dom');
  module.exports.version = '4.1.1';
});
