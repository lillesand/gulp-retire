'use strict';
var test = require('tape'),
    Vinyl = require('vinyl'),
    Readable = require('stream').Readable,
    Stream = require('stream'),
    gulpRetire = require('../');

test('should fail on streams', function(t) {
    t.plan(2);

    var streamFile = new Vinyl({
        contents: stringStream()
    });

    var stream = gulpRetire();

    stream.on('data', function() {
        t.fail('we shouldn\'t have gotten here');
    });

    stream.on('error', function(e) {
        t.ok(e instanceof Error, 'argument should be of type error');
        t.equal(e.plugin, 'gulp-retire', 'error is from gulp-retire');
    });

    stream.write(streamFile);
    stream.end();
});

test('should give error on known bad libraries', function(t) {
    t.plan(2);

    var streamFile = new Vinyl({
        path: "./test/files/jquery-1.6.js"
    });

    var stream = gulpRetire();

    stream.on('data', function() {
        t.fail("we shouldn't have gotten here");
    });

    stream.on('error', function(e) {
        t.ok(e instanceof Error, 'argument should be of type error');
        t.equal(e.plugin, 'gulp-retire', 'error is from gulp-retire');
    });

    stream.write(streamFile);
    stream.end();
});


function stringStream() {
    var stream = new Readable();

    stream._read = function() {
        this.push('sttttreeeeaaaamiiiing yum yum');
        this.push(null);
    };

    return stream;
}