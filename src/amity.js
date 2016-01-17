"use strict";
var _ = require("lodash");
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var path = Promise.promisifyAll(require("path"));
var AWS = require("aws-sdk");

var ValidatableObject = require("./utils/ValidatableObject");

var Folders = require("./AmityProjectFolders");
var Patterns = require("./AmityProjectPatterns");

var DynamoDBManager = require("./aws/managers/DynamoDBManager");
var S3Manager = require("./aws/managers/S3Manager");

/**
 * Amity Serverless project management tool.
 * @module
 */

var CONST = {
    PROJECT_FILE: ".amity.project"
};

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
var Amity = function(startPath, amityConfig) {

    this.config = {};
    _.extend(this, new ValidatableObject());
    _.merge(this.config, amityConfig);
    this.config.projectPath = startPath;


    this.folders = new Folders();
    this.patterns = new Patterns(this.folders);

    this.managers = {
        s3: require("./aws/managers/S3Manager"),
        dynamo: require("./aws/managers/DynamoDBManager"),
        sns: require("./aws/managers/SNSManager")
    };

    this.validateProjectConfig = function() {
        return true;
    };

    this.collectConfigFiles = function() {

    };

    this.setupCloud = function() {

    };

    /**
     * Initializes project folder or reads an existing one
     * @param projectFolder     {string}        Path of the folder containing project files.
     * @param options           {object}        Value object with initialization options.
     * @param options.config    {AmityConfig}   Amity Configuration Object provided as parameter. It can override existing configs.
     */
    this.init = function(projectFolder, options) {
        this.config.projectPath = projectFolder || this.config.projectPath;
        options = options || {};
        _.merge(this.config, options.config);

        var promises = [];
        promises.push(this.folders.setupProjectFolders(this.config.projectPath));

        if (!this.validateProjectConfig()) throw this.errors;
        promises.push(fs.writeFileAsync(path.join(this.config.projectPath, CONST.PROJECT_FILE), JSON.stringify(this.config), "utf8", function() {
            console.log("Created project file.");
        }));

        return Promise.all(promises);
    };
};

Amity.version = "0.2.0";

module.exports = Amity;
