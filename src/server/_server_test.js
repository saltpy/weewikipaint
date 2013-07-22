"use strict";

var app = require("./server.js");
var http = require("http");
var fs = require("fs");

exports.testHttpServerRespondsWithHelloWorld = function(test) {
    app.start(8080);
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
            app.stop();
            test.done();
        });
    });
};

exports.testServerThrowsExceptionWhenCalledWithNoPortNumber = function(test) {
    test.throws(function() {
        app.start();
    });
    test.done();
};

exports.testStopCalledBeforeStartThrowsException = function(test) {
    test.throws(function() {
        app.stop();
    });
    test.done();
};

exports.testServerRunsCallbackWhenStopCalled = function(test) {
    app.start(8080);
    app.stop(function() {
        test.done();
    });
};
