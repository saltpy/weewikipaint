"use strict";

var server = require("./server.js");

exports.testNothing = function(test) {
    test.equals(server.number(), 0, "number");
    test.done();
};
