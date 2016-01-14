"use strict";
var _ = require("lodash");

var AWSResource = require("./AWSResource");

/**
 * A resource object representing a Table in DynamoDB.
 * @typedef     {object}        DynamoDBTable
 * @property    awsAccountId    {string}                AWS Account id to be used for operations and ARN construction. If not provided, defaults to AWS standard
 * @property    regions         {Array.<string>|string} AWS Region of this table. Can be also an array of all the regions where this table should be replicated
 * @property    tableName       {string}                Name of a DynamoDBTable
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
    dynamoDBTableConfig.arnTemplate = "arn:aws:dynamodb:${config.region}:${config.awsAccountId}:table/${config.tableName}";
    _.extend(this, new AWSResource(dynamoDBTableConfig));
};


module.exports = DynamoDBTable;