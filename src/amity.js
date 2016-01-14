"use strict";
var fs = require("fs");
var path = require("path");
var _ = require("lodash");
var AWS = require("aws-sdk");

var DynamoDBManager = require("./aws/managers/DynamoDBManager");
var S3Manager = require("./aws/managers/S3Manager");

/**
 * Amity Serverless project management tool.
 * @module
 */



/**
 * Amity configuration object
 * @typedef     {object}        AmityConfig
 * @property    awsAccountId    {string}    AWS Account id to be used for operations and ARN construction. If not provided, defaults to AWS standard
 * @property    name            {string}    Project name. If not provided, it is detected from NPM paclage.json "name" attribute.
 * @property    version         {string}    Project version. If not provided, it is detected from NPM paclage.json "version" attribute.
 * @property    description     {string}    Project description. If not provided, it is detected from NPM paclage.json "description" attribute.
 * @property    resources       {object}    Collection of resources to be managed by Amity. It contains an entry for every AWS service with an array of object corresponding to resource configuration
 * @property    resources.dynamodb  {Array.<DynamoDBTable>} Collection of DynamoDBTable representing tables to be created into AWS account
 * @property    resources.s3        {Array.<S3Bucket>}      Collection of S3Bucket representing buckets to be created into AWS account
 * @property    resources.sns       {Array.<S3Bucket>}      Collection of S3Bucket representing buckets to be created into AWS account
 */

/**
 *
 * @class
 */
var Amity = function(amityConfig) {



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
                } catch (e) {
                    if (e.code != 'EEXIST') throw e;
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

    this.init = function() {

    };

    this.setupCloud = function() {

    };
};

Amity.version = "0.2.0";

module.exports = Amity;
