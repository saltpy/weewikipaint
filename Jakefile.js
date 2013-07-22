/*global desc, task, jake, fail, complete, directory */

(function() {
    "use strict";

    var NODE_VERSION = "v0.11.";
    var GENERATED_DIR = "generated";
    var TEMP_TESTFILE_DIR = GENERATED_DIR + "/static";

    directory(TEMP_TESTFILE_DIR);

    desc("Delete generated files");
    task("clean", [], function() {
        jake.rmRf("generated");
    });

    desc("Build and Test");
    task("default", ["clean", "lint", "test"]);

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
    task("test", ["node", TEMP_TESTFILE_DIR], function() {
        var reporter = require("nodeunit").reporters["default"];
        reporter.run(['src/server/_server_test.js',
                      'src/utils/_strutils_test.js'], null, function(failures) {
            if (failures) fail("Tests failed.");
            complete();
        });
    }, {async: true});

//    desc("Check node version is compatible");
    task("node", [], function() {
        var syscmd = require('procstreams');
        syscmd("node --version").data(function(err, stdout, stderr) {
            if (err) fail("No node.js found.");
            if (stdout.toString().trim().indexOf(NODE_VERSION) !== 0) {
                fail("Incompatible node.js.");
            }
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
