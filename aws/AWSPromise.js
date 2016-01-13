"use strict";
var _ = require("lodash");
var Promise = require("bluebird");
var AWS = require("aws-sdk");

var CONST = {
    PROMISIFIED_EXTENSION: "Async"
};

var AWSPromise = {};

/**
 * Returns a promisifed AWS client with added methods returning promises
 * @param awsClient {object}    AWS client to be promisified
 * @returns {*}     {object}    AWS promisified client
 */
AWSPromise.promisifyClient = function(awsClient) {
    return promisifyAWSClient(awsClient);
};


/**
 * Adds -Async functions to DynamoDB document client, making that working with promises
 * @param client    {object}    AWS client
 * @returns {*}     {object}    Promisified AWS client
 */
function promisifyAWSClient(client) {
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var ARGUMENT_NAMES = /([^\s,]+)/g;

    function getParamNames(func) {
        var fnStr = func.toString().replace(STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if (result === null)
            result = [];
        return result;
    }

    var methods = [];
    for (var key in client) {
        var params = getParamNames(client[key]);

        if ((params.length === 2) && (params[0] === "params") && (params[1] === "callback")) {
            methods.push(key);
        }

    }

    methods.forEach(function(element) {
        client[element + CONST.PROMISIFIED_EXTENSION] = function(params) {
            return new Promise(function(resolve, reject) {
                client[element](params, function(err, data) {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
        };
    });
    return client;
}


module.exports = AWSPromise;
