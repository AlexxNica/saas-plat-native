var path = require('path');

exports.get = function(){
  return {
    bundles : [__dirname + '/../../saas-plat-appfx/native'],
  };
};
