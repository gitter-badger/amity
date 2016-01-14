"use strict";
var _ = require("lodash");
var Promise = require("bluebird");
var AWS = require("aws-sdk");

/**
 * S3Manager. A module to manage S3 resources
 * @module
 */

/**
 * @typedef {object} S3ConfigObject
 * @property {string} region        - the AWS region that should be used
 * @property {string} bucketName    - name of the bucket to be managed
 */

/**
 *
 * @param options {S3ConfigObject}  - configuration object for manager
 * @class
 */
var S3Manager = function(options) {

    // A standard callback logging into the console, to be used for AWS requests operations
    function defaultCallback(error, result) {
        if (error) console.log("ERROR\n" + JSON.stringify(error));
        else console.log(JSON.stringify(result));
    }

    /** @type {S3ConfigObject} **/
    var config = {
        // default values for parameters go here
    };

    config = _.merge(config, options);
    var s3 = new AWS.S3({region: config.region});

    this.configureResources = function() {
        var params = {
            "Bucket": config.bucketName
        };
        console.log("Checking storage...");
        s3.headBucket(params, function(err, data) {
            if (err) {
                if (err.code === "NotFound") {
                    console.log("Bucket does not exists. Creating " + config.bucketName + "...");
                    params.ACL = "private";
                    s3.createBucket(params, defaultCallback);
                } else {
                    console.log("ERROR: " + err);
                }
            } else {
                console.log("Bucket " + config.bucketName + " already exists.");
            }
        });

    };

    this.destroyResources = function() {
        var params = {
            "Bucket": config.bucketName
        };
        console.log("Destroying bucket " + config.bucketName);
        s3.deleteBucket(params, defaultCallback);
    }

};

module.exports = S3Manager;