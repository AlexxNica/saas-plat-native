var fs = require('fs');
var path = require('path');
var mine = require('../../../mine').types;

exports.custom = function(request, response) {
  var realPath1 = path.join(__dirname, 'img', 'splash.png');
  console.log(realPath1);
  fs.exists(realPath1, function (exists) {
    if (exists) {
      fs.readFile(realPath1, function (err, file) {
        if (!err) {
          response.writeHead(200, {
            'Content-Type': mine.png,
            'Last-Modified': new Date().toGMTString()
          });
          response.write(file);
          response.end();
        } else {
          response.end();
        }
      });
    } else {
      response.end();
    }
  });
}
