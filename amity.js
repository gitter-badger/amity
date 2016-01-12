"use strict";
var fs = require("fs");
var path = require("path");
var _ = require("lodash");

var DynamoDBManager = require("./managers/DynamoDBManager.js");
var S3Manager = require("./managers/S3Manager.js");

/**
 * Amity Serverless project management tool.
 * @module
 */

/**
 * Some definitions useful to manage cloud resources
 */



/**
 *
 * @class
 */
var Amity = function(amityConfig) {

    var Folders = function(baseDir) {
        this.baseDir = baseDir !== undefined ? baseDir : "./";
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

        this.setupProjectFolders = function() {
            var directories = [
                path.join(this.baseDir, this.code),
                path.join(this.baseDir, this.cloud),
                path.join(this.baseDir, this.lambda),
                path.join(this.baseDir, this.webapp),
                path.join(this.baseDir, this.test),
                path.join(this.baseDir, this.dist)
            ];

            directories.forEach(function(element) {
                try {
                    fs.mkdirSync(element);
                } catch (e) {
                    if (e.code != 'EEXIST') throw e;
                }
            });
        };

    };


    var Patterns = function(baseFolder) {
        this.baseFolder = baseFolder;
        this.getAllPattern = function() {
            return "/**/*";
        };

        this.getLambdaPattern = function(functionFolder, excludeTests) {
            var path = functionFolder !== undefined ? functionFolder : this.baseFolder;

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

            return this.baseFolder + "/**/*[S|s]pec.js"
        };
    };


    this.folders = new Folders();
    this.patterns = new Patterns(this.folders.lambda);

    this.init = function() {

    };

    this.setupCloud = function() {

    };
};

Amity.version = "0.2.0";

module.exports = Amity;
