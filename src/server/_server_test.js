"use strict";

var server = require("./server.js");
var http = require("http");

exports.setUp = function(done) {
    server.start(8080);
    done();
};

exports.tearDown = function(done) {
    server.stop(function() {
        done();
    });
};

//TODO: handle stop() called before start()
//TODO: stop() callback

exports.testHttpServerRespondsWithHelloWorld = function(test) {
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
            test.done();
        });
    });
};

exports.testServerRunsCallbackWhenStopCompletes = function(test) {
    server.stop(function() {
        test.done();
    });
    server.start(); //TODO: kludge this so tearDown runs
};
