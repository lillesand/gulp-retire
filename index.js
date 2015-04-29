'use strict';
var through = require('through2'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError;

module.exports = function() {
    var retire = function (file, encoding, callback) {
        if (file.isStream()) {
            return callback(createError(file, 'Streams are not supported'));
        }
    };
    return through.obj(retire);
};


function createError(file, err) {
    return new PluginError('gulp-retire', file.path + ': ' + err, {
        fileName: file.path,
        showStack: false
    });
}