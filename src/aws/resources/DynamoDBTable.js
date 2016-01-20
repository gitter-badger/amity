"use strict";
var _ = require("lodash");

var AWSResource = require("./AWSResource");

/**
 * A resource object representing a Table in DynamoDB.
 * @typedef     {object}        DynamoDBTable
 * @extends     AWSResource
 * @property    awsAccountId    {string}                AWS Account id to be used for operations and ARN construction. If not provided, defaults to AWS standard
 * @property    arn             {string}                ARN representing a Table.
 * @property    readThroughput  {number}                Read Throughput of this table
 * @property    writeThroughput {number}                Write Throughput of this table
 */

/**
 * @type    {DynamoDBTable}
 * @param   dynamoDBTableConfig {DynamoDBTable} Configuration object
 * @class
 */
var DynamoDBTable = function(dynamoDBTableConfig) {
    dynamoDBTableConfig.arnTemplate = "arn:aws:dynamodb:${config.region}:${config.awsAccountId}:table/${config.name}";
    _.extend(this, new AWSResource(dynamoDBTableConfig));
};


module.exports = DynamoDBTable;