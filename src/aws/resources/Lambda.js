"use strict";
var _ = require("lodash");
var AWSResource = require("./AWSResource");

/**
 * @typedef     {object}    Lambda
 * @extends     AWSResource
 * @property    name        {string}                Name of the Lambda function
 * @property    handler     {string}                File and action handler of the function
 * @property    timeout     {number}                Seconds before function timeouts
 * @property    memorySize  {number}                Megabytes to be allocated as memory available to function. CPU size is calculated by Lambda based on memory.
 * @property    eventSource {string}                ARN or placeholder name for an event source that triggers this lambda
 * @property    endpoints   {Array.<APIEndpoint>}   List of endpoints pointing to this lambda function
 */

/**
 * Resource mapping to a Lambda function
 * @param lambdaConfig  {Lambda}    Configuration object
 * @class
 */
var Lambda = function(lambdaConfig) {
    lambdaConfig.arnTemplate = "arn:aws:lambda:${config.region}:${config.name}";
    _.extend(this, new AWSResource(lambdaConfig));


};

module.exports = Lambda;