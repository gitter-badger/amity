"use strict";
var fs = require("fs");
var path = require("path");

var Amity = function() {

    var Folders = function() {
        this.code = "code";
        this.cloud = "cloud";
        this.lambda = this.code + "/lambda";
        this.webapp = this.code + "/web";
        this.test = "test";
        this.dist = "dist";

        this.readyToPackage = this.dist + "/dev";
        this.readyToUpload = this.dist + "/prod";

        this.getLambdaFunctions = function(dir) {
            return fs.readdirSync(dir)
                .filter(function(file) {
                    return fs.statSync(path.join(dir, file)).isDirectory();
                });
        };

        this.setupProjectFolders = function(baseDir) {
            if (baseDir === undefined) baseDir = "./";
            var directories = [
                path.join(baseDir, this.code),
                path.join(baseDir, this.cloud),
                path.join(baseDir, this.lambda),
                path.join(baseDir, this.webapp),
                path.join(baseDir, this.test),
                path.join(baseDir, this.dist)
            ];

            directories.forEach(function(element) {
                try {
                    fs.mkdirSync(element);
                }catch (e) {
                    if ( e.code != 'EEXIST' ) throw e;
                }
            });
        };

    };


    var Patterns = function(baseFolders) {

        this.getAllPattern = function() {
            return "/**/*";
        };

        this.getLambdaPattern = function(functionFolder, excludeTests) {
            var path = functionFolder !== undefined ? functionFolder : baseFolders;

            excludeTests = excludeTests !== undefined ? excludeTests : false;
            var pattern = [
                path + "/**/*",
                "!" + path + "/**/node_modules/aws-sdk/**/*",   // exclude AWS SDK files (already included in lambda)
                "!" + path + "/**/node_modules/aws-sdk",        // exclude AWS SDK folder
                "!" + path + "/**/node_modules/**/*min.js",     // exclude minified version of libraries so can minify the rest
                "!" + path + "/**/node_modules/**/*.map",       // exclude sourcemaps that are not relevant
                "!" + path + "/**/*package.json"
            ];
            if (excludeTests) {
                pattern = pattern.concat([
                    "!" + path + "/test/**/*",                          // exclude test folder
                    "!" + path + "/test",                          // exclude test folder
                    "!" + path + "/**/test*.json",                    // exclude test events
                    "!" + path + "/**/test*.js",                      // exclude test files
                ]);
            }
            return pattern;
        };
        this.getTestsPattern = function() {
            return baseFolders.lambda + "/**/*[S|s]pec.js"
        };
    };


    this.folders = new Folders();

    this.patterns = new Patterns(this.folders.lambda);
};

Amity.version = "0.0.1";

module.exports = Amity;
