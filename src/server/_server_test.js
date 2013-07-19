"use strict";

var server = require("./server.js");
var http = require("http");
var fs = require("fs");

exports.testHttpServerRespondsWithHelloWorld = function(test) {
    server.start(8080);
    http.get("http://localhost:8080", function(response) {
        var recievedData = false;
        response.setEncoding("utf8");
        test.equals(200, response.statusCode, "status code");
        response.on("data", function(chunk) {
            recievedData = true;
            test.equals("Hello World", chunk, "hello world");
        });
        response.on("end", function() {
            test.ok(recievedData, "should have recieved response data");
            server.stop();
            test.done();
        });
    });
};

exports.testServerThrowsExceptionWhenCalledWithNoPortNumber = function(test) {
    test.throws(function() {
        server.start();
    });
    test.done();
};

exports.testStopCalledBeforeStartThrowsException = function(test) {
    test.throws(function() {
        server.stop();
    });
    test.done();
};

exports.testServerRunsCallbackWhenStopCalled = function(test) {
    server.start(8080);
    server.stop(function() {
        test.done();
    });
};

exports.testServerServesAFile = function(test) {
    var testDir = "generated/test";
    var testFile = testDir + "/test.html";
    
    try {
        fs.writeFileSync(testFile, "Hello World");
        test.ok(false, "failed!");
        test.done();
    } finally {
        fs.unlinkSync(testFile);
        test.ok(!fs.existsSync(testFile));
        test.done();
    }
};
