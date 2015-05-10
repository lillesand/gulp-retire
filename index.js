'use strict';
var through = require('through2'),
    gutil = require('gulp-util'),
    path = require('path'),
    os = require('os'),
    PluginError = gutil.PluginError,
    repo    = require('retire/lib/repo'),
    scanner = require('retire/lib/scanner');

module.exports = function() {

    var gulpRetire = function (file, encoding, callback) {
        var options = {
            jsRepository: 'https://raw.github.com/RetireJS/retire.js/master/repository/jsrepository.json',
            nodeRepository: 'https://raw.github.com/RetireJS/retire.js/master/repository/npmrepository.json'
        };

        if (file.isStream()) {
            return callback(createError(file, 'Streams are not supported'));
        }

        scanner.on('vulnerable-dependency-found', function(e) {
            return callback(createError(file, 'Vulnerable library found'));
        });

        scanner.on('dependency-found', function(e) {

        });

        var vulnerabilityRepoLoaded = function(repository) {
            scanner.scanJsFile(file.path, repository, options);
        };

        if (!options.nocache) {
            options.cachedir = path.resolve(os.tmpdir(), '.retire-cache/');
        }
        if (/^http[s]?:/.test(options.jsRepository)) {
            repo.loadrepository(options.jsRepository, options).on('done', vulnerabilityRepoLoaded);
        } else {
            repo.loadrepositoryFromFile(options.jsRepository, options).on('done', vulnerabilityRepoLoaded);
        }
    };
    return through.obj(gulpRetire);
};


function createError(file, err) {
    return new PluginError('gulp-retire', file.path + ': ' + err, {
        fileName: file.path,
        showStack: false
    });
}