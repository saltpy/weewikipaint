"use strict";

var express = require("express");
var http = require("http");
var server;
var app;

exports.start = function(port, dirname, ready) {
    if(!port) throw "Require port number";
    if(!dirname) throw "Require a directory to act as root";

    app = express();
    app.use(express.static(dirname));

    app.get("/", function(req, res) {
        res.end("Hello World");
    });

    server = app.listen(port, function() {
        console.log("Server running on port %d for %s root", port, dirname);
        ready();
    });
};

exports.stop = function(callback) {
    console.log("Halting server and application");
    server.close(callback);
};
