"use strict";
var _ = require("lodash");
var Promise = require("bluebird");
var AWS = require("aws-sdk");

/**
 * SNSManager. A module to manage SNS topics
 * @module
 */

/**
 * @typedef {object} SNSConfigObject
 * @property {string} region        - the AWS region that should be used
 * @property {string} topicArn      - Arn of a topic
 */

/**
 *
 * @param options {SNSConfigObject}  - configuration object for manager
 * @class
 */
var SNSManager = function(options) {

    // A standard callback logging into the console, to be used for AWS requests operations
    function defaultCallback(error, result) {
        if (error) console.log("ERROR\n" + JSON.stringify(error));
        else console.log(JSON.stringify(result));
    }

    /** @type {SNSConfigObject} **/
    var config = {
        // default values for parameters go here
    };

    config = _.merge(config, options);
    var sns = new AWS.SNS({region: config.region});

    /**
     * Creates required cloud resources
     */
    this.configureResources = function() {
        var topicName = config.topicArn.split(/[:]+/).pop();

        var params = {
            "Name": topicName
        };
        console.log("Checking SNS topics...");
        sns.createTopic(params, function(error, data) {
            if (error) console.log("ERROR\n" + JSON.stringify(error));
            else {
                config.topicArn = data.TopicArn;
                console.log(JSON.stringify(data));
            }
        });

    };

    this.destroyResources = function() {
        var params = {
            "TopicArn": config.topicArn
        };
        console.log("Destroying topic " + config.topicArn);
        sns.deleteTopic(params, defaultCallback);
    }

};

module.exports = SNSManager;