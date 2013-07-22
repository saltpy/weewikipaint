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

var httpGetAndAssert = function(test, expectedBodyText, urlToGet, expectedResponseCode, setupFunc) {
    if (typeof(setupFunc) !== "undefined") setupFunc();
    var request = http.get(urlToGet);
    request.on("response", function(response) {
        var actualBodyText = "";
        test.equals(expectedResponseCode, response.statusCode);

        response.on("data", function(chunk) {
            actualBodyText += chunk;
        });

        response.on("end", function() {
            test.equals(expectedBodyText, actualBodyText);
            test.done();
        });
    });
};

exports.test_servesHomePageFromFile = function(test) {
    var expected = "Test homepage file";
    httpGetAndAssert(test, expected, "http://localhost:8080", 200, function() {
        fs.writeFileSync(TEST_STATIC_DIR + '/index.html', expected);
    });
};

exports.test_serves404WhenFileDoesNotExist = function(test) {
    var expected = "Sorry cant find that!";
    httpGetAndAssert(test, expected, "http://localhost:8080", 404);
};
