var path = require('path');

exports.get = function(){
  return {
    BUNDLE_SRC : path.dirname(__dirname) + path.sep + 'src'
  };
};
