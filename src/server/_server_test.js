"use strict";

var server = require("./server.js");

exports.testNothing = function(test) {
    test.equals(0, server.number(), "number");
    test.done();
};
