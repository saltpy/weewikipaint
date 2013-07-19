"use strict";

var strutils = require("./strutils.js");

exports.testStartsWithCorrectCase = function(test) {
    test.ok(strutils.startsWith("bobby moore", "bob"));
    test.done();
};

exports.testStartsWithIncorrectCase = function(test) {
    test.ok(! strutils.startsWith("marylin monroe", "mazza"));
    test.done();
};
