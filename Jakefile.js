/*global desc, task, jake, fail, complete */

(function() {
    "use strict";

    var fs = require("fs");
    var sys = require("sys");
    var exec = require("child_process").exec;

    var passed = true;

    desc("Build and Test");
    task("default", ["lint"]);

    desc("Lint everything");
    task("lint", [], function() {
        var lint = require("./build/lint/lint_runner.js");

        var files = new jake.FileList();
        files.include("**/*.js");
        files.exclude("node_modules");

        var options = nodeLintOptions();

        passed = lint.validateFileList(files.toArray(), options, {});
    });

    desc("CI");
    task("CI", ["default"], function() {
        var known_good_id = fs.readFileSync(".last_known_good", "utf8");
        var child;
        if (! passed) {
            child = exec("git reset --hard " + known_good_id + " && git push");
            fail("Integration failed. Rolling back to last known good commit");
        } else {
            child = exec("git rev-parse HEAD > .last_known_good && git add .last_known_good && git commit -m 'CI Passed - bump last known good'");

            console.log("CI passed.");
        }
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
