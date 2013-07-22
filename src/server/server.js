"use strict";

var express = require("express");
var http = require("http");
var server;
var app;

exports.start = function(port) {
    if(!port) throw "Require port number";

    app = express();

    app.get("/", function(req, res) {
        res.end("Hello World");
    });

    server = app.listen(port);
};

exports.stop = function(callback) {
    server.close(callback);
};
