"use strict";

var _ = require("lodash");
var Promise = require("bluebird");
var AWS = require("aws-sdk");
var AWSPromise = require("../AWSPromise");

var fs = Promise.promisifyAll(require("fs"));
var exec = require("exec");

/**
 * @module
 */

var CONS = {
    TEMPLATE_FOLDER: "."
};

/**
 * Maanges Lambda function creation and deployment
 * @param lambdaConfig  {Lambda}    Configuration object
 * @class
 */
var LambdaManager = {};

/**
 * Creates locally a new Lambda function from templates
 * @param config        {Lambda}    Configuration object for this lambda function
 * @param resourcePath  {string}    Path belonging to resource
 */
LambdaManager.initResource = function(config, resourcePath) {
    var packageJSON = {
        name: config.name,
        version: "0.2.0",
        dependencies: {
            "aws-sdk": "^2.2.27",
            "bluebird": "^3.1.1",
            "lodash": "^3.10.1"
        }
    };
    return fs.writeFileAsync(resourcePath + "/package.json", JSON.stringify(packageJSON))
        .then(function() {
            exec(["cd "+resourcePath+"npm install"], function(err, out, code) {

            });
        });
    //var exec = require('child_process').execFile;
};

/**
 * Creates a new Lambda function if it does not exist
 * @param config    {Lambda}        Configuration object for this lambda function
 * @param client    {AWS.Lambda}    AWS Client to manage lambda functions. Optional.
 */
LambdaManager.deployResource = function(config, client) {
    /** @type {AWS.Lambda} **/
    var lambdaClient = client ? client : AWSPromise.promisifyClient(new AWS.Lambda({region: config.region}));
};


/**
 * Updates a Lambda function.
 * @param config    {Lambda}        Configuration object for this lambda function
 * @param client    {AWS.Lambda}    AWS Client to manage lambda functions. Optional.
 */
LambdaManager.updateResource = function(config, client) {
    /** @type {AWS.Lambda} **/
    var lambdaClient = client ? client : AWSPromise.promisifyClient(new AWS.Lambda({region: config.region}));
};

/**
 * Deletes a Lambda function.
 * @param config    {Lambda}        Configuration object for this lambda function
 * @param client    {AWS.Lambda}    AWS Client to manage lambda functions. Optional.
 */
LambdaManager.deleteResource = function(config, client) {
    /** @type {AWS.Lambda} **/
    var lambdaClient = client ? client : AWSPromise.promisifyClient(new AWS.Lambda({region: config.region}));
};

module.exports = LambdaManager;