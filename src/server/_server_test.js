"use strict";

var app = require("./server.js");
var http = require("http");
var syscmd = require("procstreams");
var fs = require("fs");

var TEST_STATIC_DIR = "generated/static";

exports.setUp = function(callback) {
    var server = app.start(8080, TEST_STATIC_DIR, callback);
};

exports.tearDown = function(callback) {
    syscmd("rm -rf " + TEST_STATIC_DIR).on("exit", function() {
        app.stop(callback);
    });
};

exports.test_servesHomePageFromFile = function(test) {
    var expected = "Test homepage file";
    fs.writeFileSync(TEST_STATIC_DIR + '/index.html', expected);
    
    var request = http.get('http://localhost:8080/index.html');
    request.on("response", function(response) {
        var actual = "";
        test.equals(200, response.statusCode);

        response.on("data", function(chunk) {
            actual += chunk;
        });

        response.on("end", function() {
            test.equals(expected, actual);
            test.done();
        });
    });
};

exports.test_serves404WhenFileDoesNotExist = function(test) {
    var expected = "Sorry cant find that!";
    var request = http.get("http://localhost:8080");
    request.on("response", function(response) {
        var actual = "";
        test.equals(404, response.statusCode);

        response.on("data", function(chunk) {
            actual += chunk;
        });

        response.on("end", function() {
            test.done();
        });
    });
};
