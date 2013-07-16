/*global desc, task, jake, fail, complete */

(function() {
    "use strict";

    desc("Build and Test");
    task("default", ["lint"]);

    desc("Lint everything");
    task("lint", [], function() {
        var lint = require("./build/lint/lint_runner.js");

        var files = new jake.FileList();
        files.include("**/*.js");
        files.exclude("node_modules");

        var options = nodeLintOptions();

        lint.validateFileList(files.toArray(), options, {} || fail("Linting failed."));
    });

    desc("CI");
    task("CI", ["default"], function() {
        console.log("1. Make sure 'git status' is clean.");
        console.log("2. Run 'git pull'.");
        console.log("3. Run 'npm install' and make sure its clean.");
        console.log("4. Run 'npm test' and make sure its clean.");
        console.log("    a. If 4 fails start over and debug.");
        console.log("5. Run 'git checkout ci'.");
        console.log("6. Run 'git merge master --no-ff --log'.");
        console.log("7. Run 'git checkout master'");
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
