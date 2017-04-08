var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var root = path.dirname(__dirname);

require('./server');
require('./watch');


var cli = exec('node ' + path.join(root, 'node_modules/react-native/local-cli/cli.js start'));
cli.stdout.on('data', function (data) {
  console.log(data.replace('\n', ''));
});
cli.stderr.on('data', function (data) {
  console.error(data.replace('\n', ''));
});
