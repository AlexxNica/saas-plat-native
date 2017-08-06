var readline = require('readline');
var assign = require('lodash.assign');
var throttle = require('lodash.throttle');
var outputSameline = function (str) {
    readline.clearLine(process.stdout, 0); // clear current text
    readline.cursorTo(process.stdout, 0); // move cursor to beginning of line
    process.stdout.write(str);
};
var outputNewline = function (str) {
    console.log(str);
};
module.exports = function (options) {
    options = assign({
        sameLine: process.stdout.isTTY,
        progressLength: 50,
        arrowHead: '>',
        arrowBody: '=',
        unfinished: '-',
        label: '[webpack] : ',
        throttle: 0
    }, options);
    var output = outputSameline;
    if (!options.sameLine) {
        output = outputNewline;
    }
    var handler = function (percentage, message) {
        var arrowLength = Math.floor(percentage * options.progressLength);
        if (percentage === 1) {
            options.arrowHead = options.arrowBody;
            message += "\n";
        }
        output(options.label   + (percentage * 100).toFixed(0) + '%  ' + message);
    };
    if (options.throttle > 0) {
        handler = throttle(handler, options.throttle);
    }
    return handler;
};