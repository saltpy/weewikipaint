/*global desc, task, jake, fail, complete */

(function() {
    "use strict";

    desc("Build and Test");
    task("default", ["lint", "test"]);

    desc("Lint everything");
    task("lint", ["node"], function() {
        var lint = require("./build/lint/lint_runner.js");

        var files = new jake.FileList();
        files.include("**/*.js");
        files.exclude("node_modules");

        var options = nodeLintOptions();

        var passed = lint.validateFileList(files.toArray(), options, {});
        if (! passed) fail("Linting failed.");
    });

    desc("Run All Tests");
    task("test", ["node"], function() {
        var reporter = require("nodeunit").reporters["default"];
        reporter.run(['src/server/_server_test.js'], null, function(failures) {
            if (failures) fail("Tests failed.");
            complete();
        });
    }, {async: true});

//    desc("Check node version is compatible");
    task("node", [], function() {
        var syscmd = require('procstreams');
        syscmd("node --version").data(function(err, stdout, stderr) {
            if (err) fail("No node.js found.");
            var vers = stdout.toString().trim();
            if (vers !== 'v0.11.1-pre') fail("Incompatible node.js.");
            complete();
        });
    }, {async:true});

    function nodeLintOptions() {
        return {
            bitwise:true,
            curly:false,
            eqeqeq:true,
            forin:true,
            immed:true,
            latedef:true,
            newcap:true,
            noarg:true,
            noempty:true,
            nonew:true,
            regexp:true,
            undef:true,
            strict:true,
            trailing:true,
            node:true
        };
    }
}());
