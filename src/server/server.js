"use strict";

var express = require("express");
var http = require("http");
var server;
var app;

exports.start = function(port, dirname, ready) {
    port = (typeof port === "undefined") ? 8080 : port;
    dirname = (typeof dirname === "undefined") ? "express-root" : dirname;
    ready = (typeof ready === "undefined") ? function(){} : ready;

    app = express();
    app.use(express.static(dirname));

    app.use(function(req, res, next) {
        res.send(404, "Sorry cant find that!");
    });

    server = app.listen(port, function() {
        ready();
    });
};

exports.stop = function(callback) {
    callback = (typeof callback === "undefined") ? function(){} : callback;
    server.close(callback);
};
