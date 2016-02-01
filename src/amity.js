"use strict";
var _ = require("lodash");
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var path = Promise.promisifyAll(require("path"));
var AWS = require("aws-sdk");

var Validator = require("./utils/Validator");

var Folders = require("./AmityProjectFolders");
var Patterns = require("./AmityProjectPatterns");

var DynamoDBManager = require("./aws/managers/DynamoDBManager");
var S3Manager = require("./aws/managers/S3Manager");

/**
 * Amity Serverless project management tool.
 * @module
 */

var CONF = {
    PROJECT_FILE: ".amity.project",
    AWS_MANAGERS_PATH: "./aws/managers",
    PATTERN_AMITY_RESOURCES: "**/*.res.json"
};

/**
 * Amity configuration object
 * @typedef     {object}        AmityConfig
 * @property    awsAccountId    {string}                    AWS Account id to be used for operations and ARN construction. If not provided, defaults to AWS standard
 * @property    name            {string}                    Project name. If not provided, it is detected from NPM paclage.json "name" attribute.
 * @property    version         {string}                    Project version. If not provided, it is detected from NPM paclage.json "version" attribute.
 * @property    description     {string}                    Project description. If not provided, it is detected from NPM paclage.json "description" attribute.
 * @property    regions         {Array.<string>|string}     AWS Region of this table. Can be also an array of all the regions where this table should be replicated
 * @property    resources       {object}                    Collection of resources to be managed by Amity. It contains an entry for every AWS service with an array of object corresponding to
 *                                                          resource configuration
 * @property    resources.dynamodb  {Array.<DynamoDBTable>} Collection of DynamoDBTable representing tables to be created into AWS account
 * @property    resources.s3        {Array.<S3Bucket>}      Collection of S3Bucket representing buckets to be created into AWS account
 * @property    resources.sns       {Array.<S3Bucket>}      Collection of S3Bucket representing buckets to be created into AWS account
 * @property    resources.lambda    {Array.<Lambda>}        Collection of Lambda objects representing lambda functions to be created into AWS account
 * @property    resources.api       {Array.<APIEndpoint>}   Collection of APIEndpoint objects representing APIs to be created into AWS account
 */


/**
 * Creates a new Amity object to handle serverless project configuration
 * @param startPath     {string}        Path where project is located and amity should start work
 * @param amityConfig   {AmityConfig}   Amity configuration object
 * @class
 */
var Amity = function(startPath, amityConfig) {

    /** @type {AmityConfig} **/
    this.config = {
        resources: {
            dynamodb: [],
            s3: [],
            sns: [],
            lambda: [],
            api: []
        }
    };

    _.extend(this, new Validator.Validatable());
    _.merge(this.config, amityConfig);
    this.config.projectPath = startPath;


    this.folders = new Folders();
    this.patterns = new Patterns(this.folders);

    this.managers = {
        s3: require(CONF.AWS_MANAGERS_PATH + "/S3Manager"),
        dynamo: require(CONF.AWS_MANAGERS_PATH + "/DynamoDBManager"),
        sns: require(CONF.AWS_MANAGERS_PATH + "/SNSManager"),
        lambda: require(CONF.AWS_MANAGERS_PATH + "/LambdaManager")
    };

    this.validateProjectConfig = function() {
        return true;  //FIXME: remove this and set validation
    };

    /**
     * Collects every file ending with *.res.json and aggregates it into
     * @param projectFolder     {string}        Path of the folder containing project files.
     * @param options           {object}        Value object with initialization options.
     * @returns {Promise}       A promise that handles this task
     */
    this.collectConfigFiles = function(projectFolder, options) {
        var globby = require('globby');
        projectFolder = projectFolder || this.config.projectPath;
        options = options || {};
        var _self = this;

        return globby(CONF.PATTERN_AMITY_RESOURCES)
            .then(function(resourceFileName) {
                // reads resource file into an obejct
                return fs.readFileAsync(resourceFileName);
            })
            .then(function(resourceString) {
                return JSON.parse(resourceString);
            })
            .then(function(resource) {
                if (_.isArray(resource)) {
                    // check wheter or not it is an array. If it is
                    // iterates over every resource in the file identified by glob
                    for (var key in resource) {
                        if (resource.hasOwnProperty(key)) {
                            _self.config.resources[key].concat(resource[key]);
                        }

                    }
                } else if (_.isObject(resource)) {
                    for (var key in resource) {
                        if (resource.hasOwnProperty(key)) {
                            _self.config.resources[key].push(resource[key]);
                        }
                    }
                }
                return _self.config;
            });
    };

    this.setupCloud = function() {

    };

    /**
     * Initializes project folder or reads an existing one
     * @param projectFolder     {string}        Path of the folder containing project files.
     * @param options           {object}        Value object with initialization options.
     * @param options.config    {AmityConfig}   Amity Configuration Object provided as parameter. It can override existing configs.
     * @returns {Promise}       A promise mapping all folders being set up
     */
    this.init = function(projectFolder, options) {
        this.config.projectPath = projectFolder || this.config.projectPath;
        options = options || {};
        _.merge(this.config, options.config);

        var promises = [];
        promises.push(this.folders.setupProjectFolders(this.config.projectPath));

        if (!this.validateProjectConfig()) throw this.errors;
        promises.push(fs.writeFileAsync(path.join(this.config.projectPath, CONF.PROJECT_FILE), JSON.stringify(this.config), "utf8", function() {
            console.log("Created project file.");
        }));

        return Promise.all(promises);
    };
};

Amity.version = "0.2.0";

module.exports = Amity;
