"use strict";

var app = require("./server.js");
var http = require("http");
var syscmd = require("procstreams");
var fs = require("fs");

var TEST_STATIC_DIR = "generated/static";

var fileCleanUp = function(callback) {
    syscmd("rm -rf " + TEST_STATIC_DIR).on("exit", function() {
        callback();
    });
};

exports.setUp = function(callback) {
    var server = app.start(8080, TEST_STATIC_DIR, callback);
};

exports.tearDown = function(callback) {
    app.stop(callback);
};

//exports.test_servesHomePageFromFile = function(test) {
//    var expected = "Test homepage file";
//    fs.writeFileSync(TEST_STATIC_DIR + '/index.html', expected);
//
//    app.start(8080, TEST_STATIC_DIR);
//
//    var req = http.get('http://localhost:8080');
//    req.on("response", function(response) {
//        var data = "";
//        response.setEncoding("utf8");
//
//        response.on("data", function(chunk) {
//            data += chunk;
//        });
//
//        response.on("end", function() {
//            app.stop(function() {
//                test.equals(200, response.statusCode);
//                test.equals(data, data);
//                exports.fileCleanUp(function() {
//                    test.done();
//                });
//            });
//        });
//    });
//};

exports.testServerThrowsExceptionWhenCalledWithNoPortNumber = function(test) {
    test.throws(function() {
        app.start();
    });
    test.done();
};

exports.testServerRunsCallbackWhenStopCalled = function(test) {
    test.done();
};
