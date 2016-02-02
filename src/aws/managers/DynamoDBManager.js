"use strict";
var _ = require("lodash");
var Promise = require("bluebird");
var AWS = require("aws-sdk");
var AWSPromise = require("../AWSPromise");

/**
 * DynamoManager module. A class to handle DynamoDB persistence units, at an higher level of abstraction
 * @module DynamoDBManager
 */

/**
 * @extends {AmityResourceManager}
 * @type {AmityResourceManager}
 */
var DynamoDBManager = {};
/**
 * Creates DynamoDB tables
 * @param config    {DynamoDBTable} Table configuration object
 * @param client    {AWS.DynamoDB}  promisified DynamoClient
 */
DynamoDBManager.createResource = function(config, client) {
    var dynamodb = client ? client : AWSPromise.promisifyClient(new AWS.DynamoDB({region: config.region}));

    var params = {
        TableName: config.name
    };

    console.log("Checking database...");
    return dynamodb.describeTableAsync(params)
        .then(function(data) {
            console.log("Database " + config.name + " already exists.");
            var pt = data.Table.ProvisionedThroughput;
            if ((pt.ReadCapacityUnits !== config.readThroughput) ||     // check throughput if is correct or has changed
                (pt.WriteCapacityUnits !== config.writeThroughput)) {
                console.log("But has the wrong capacity, so we have to correct this");
                params.ProvisionedThroughput = {
                    "ReadCapacityUnits": config.readThroughput,
                    "WriteCapacityUnits": config.writeThroughput
                };
                return dynamodb.updateTableAsync(params)
                    .thenReturn(config);
            } else {
                return config; //returns data which is of the same type of
            }
        })
        .catch(function(err) {
            if (err.statusCode === 400) {
                console.log("Table does not exists. Creating " + config.name + "...");
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
                return dynamodb.createTableAsync(params)
                    .thenReturn(config);
            } else {
                throw err;
            }

        });
};

/**
 * Deletes a resource
 * Creates resources
 * @param config    {DynamoDBTable} Table configuration object
 * @param client    {AWS.DynamoDB}  promisified DynamoClient
 */
DynamoDBManager.deleteResource = function(config, client) {
    var dynamodb = client ? client : AWSPromise.promisifyClient(new AWS.DynamoDB({region: config.region}));

    console.log("Deleting config " + config.name);
    var params = {
        TableName: config.name
    };
    return dynamodb.deleteTableAsync(params);
};


module.exports = DynamoDBManager;