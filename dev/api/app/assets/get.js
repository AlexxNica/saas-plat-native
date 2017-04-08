var fs = require('fs');
var path = require('path');
var mine = require('../../../mine').types;
var url = require('url');
var querystring = require('querystring');

exports.custom = function(request, response) {
  var theurl = url.parse(request.url);
  var qs3 = querystring.parse(theurl.query);
  var realPath1 = path.join(__dirname, '../../../../', "src", qs3.name);
  console.log(realPath1);
  fs.exists(realPath1, function(exists) {
    if (!exists) {
      response.writeHead(404, { 'Content-Type': 'application/json;charset=utf-8' });
      response.write("This request URL " + theurl +
        " was not found on this server.");
      response.end();
    } else {
      fs.readFile(realPath1, function(err, file) {
        if (err) {
          response.writeHead(500);
          response.end(err);
        } else {
          response.writeHead(200, { 'Content-Type': mine.png });
          response.write(file);
          response.end();
        }
      });
    }
  });
}
