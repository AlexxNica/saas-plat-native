var fs = require('fs');
var path = require('path');

exports.custom = function(request, response) {

  // 数据块接收中
  var postData = '';
  request.addListener("data", function(postDataChunk) {
    postData += postDataChunk;
  });
  // 数据接收完毕，执行回调函数
  request.addListener("end", function() {
    try {
      //var data = lzwCompress.unpack(Buffer.from(postData, 'base64'));
      console.log(postData);
    } catch (err) {
      console.log(err);
    }
    response.end();
  });
};
