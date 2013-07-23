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

        var srcFiles = new jake.FileList();
        srcFiles.include("**/*.js");
        srcFiles.exclude("node_modules");
        srcFiles.exclude("*.conf.js");

        var options = nodeLintOptions();

        var passed = lint.validateFileList(srcFiles.toArray(), options, {});
        if (! passed) fail("Linting failed.");
    });

    desc("Test everything");
    task("test", ["testServer", "testClient"]);

    desc("Run Server Tests");
    task("testServer", ["node", TEMP_TESTFILE_DIR], function() {
        var testFiles = new jake.FileList();
        testFiles.include("**/_*_test.js");
        testFiles.exclude("node_modules");
        testFiles.exclude("src/client/_*_test.js");

        var reporter = require("nodeunit").reporters["default"];
        reporter.run(testFiles.toArray(), null, function(failures) {
            if (failures) fail("Tests failed.");
            complete();
        });
    }, {async: true});

    desc("Run Client Tests");
    task("testClient", function() {
        var karmaServer = require("karma/lib/server");
        var karmaConfig = require("karma/lib/config");
        var conf = karmaConfig.parseConfig("./karma.conf.js",
            {"browsers": ["Chrome", "Firefox"],
             "singleRun": true,
             "port": 8145});
        console.log(conf);
        karmaServer.start(conf, function(exitCode) {
            if (exitCode) fail("Karma has exited with " + exitCode);
            process.exit(exitCode);
        });
    });

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
