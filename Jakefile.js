/*global desc, task, jake, fail, complete */

(function() {
    "use strict";

    desc("Build and Test");
    task("default", ["lint", "test"]);

    desc("Lint everything");
    task("lint", [], function() {
        var lint = require("./build/lint/lint_runner.js");

        var files = new jake.FileList();
        files.include("**/*.js");
        files.exclude("node_modules");

        var options = nodeLintOptions();

        var passed = lint.validateFileList(files.toArray(), options, {});
        if (! passed) fail("Linting failed.");
    });

    desc("Run All Tests");
    task("test", [], function() {
        var reporter = require("nodeunit").reporters["default"];
        reporter.run(['src/server/_server_test.js']);
    });

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
