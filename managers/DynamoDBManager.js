"use strict";
var _ = require("lodash");
var AWS = require("aws-sdk");

/**
 * DynamoManager module. A class to handle DynamoDB persistence units, at an higher level of abstraction
 * @module DynamoDBManager
 */

/**
 * @typedef {object} DynamoDBConfigObject
 * @property {string} region           - the AWS region that should be used
 * @property {string} tableName        - the name of DynamoDB persistence table to be used
 * @property {number} readThroughput   - read throughtput of this table
 * @property {number} writeThroughput  - write throughtput for this table
 * *
 */

/**
 * @class
 * @param {DynamoDBConfigObject} options                  - the configuration object for this manager
 */
var DynamoDBManager = function(options) {

    // A standard callback logging into the console, to be used for AWS requests operations
    function defaultCallback(error, result) {
        if (error) console.log("ERROR\n" + JSON.stringify(error));
        else console.log(JSON.stringify(result));
    }

    /** @type {DynamoDBConfigObject} **/
    var config = {
        // default values for parameters go here
    };

    config = _.merge(config, options);
    var dynamodb = new AWS.DynamoDB({region: config.region});

    /**
     * Initializes remote objets if they do not exists
     */
    this.configureResources = function() {
        var params = {
            TableName: config.tableName
        };


        console.log("Checking database...");
        dynamodb.describeTable(params, function(err, data) {    // check whether table exists
            if (err) {                                          // and creates it if necessary
                if (err.statusCode === 400) {
                    console.log("Table does not exists. Creating" + config.tableName + "...");
                    params.AttributeDefinitions = [
                        {"AttributeName": "uuid", "AttributeType": "S"}
                    ];
                    params.KeySchema = [
                        {"AttributeName": "uuid", "KeyType": "HASH"}
                    ];
                    params.ProvisionedThroughput = {
                        "ReadCapacityUnits": config.readThroughput,
                        "WriteCapacityUnits": config.writeThroughput
                    };
                    dynamodb.createTable(params, defaultCallback);
                } else {
                    console.log("ERROR: " + err);
                }

            } else {    // if table exists
                console.log("Database " + config.tableName + " already exists.");
                var pt = data.Table.ProvisionedThroughput;
                if ((pt.ReadCapacityUnits !== config.readThroughput) ||     // check throughput if is correct or has changed
                    (pt.WriteCapacityUnits !== config.writeThroughput)) {
                    console.log("But has the wrong capacity, so we have to correct this");
                    params.ProvisionedThroughput = {
                        "ReadCapacityUnits": config.readThroughput,
                        "WriteCapacityUnits": config.writeThroughput
                    };
                    dynamodb.updateTable(params, defaultCallback);
                }

            }
        });

    };

    /**
     * Deletes the table and all of its records from DynamoDB
     */
    this.destroyResources = function() {
        console.log("Deleting table " + config.tableName);
        var params = {
            TableName: config.tableName
        };
        dynamodb.deleteTable(params, defaultCallback);
    };

};

module.exports = DynamoDBManager;