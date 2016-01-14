"use strict";
var _ = require("lodash");

var AWSResource = require("./AWSResource");


/**
 * A resource object representing a SNS topic
 * @typedef     {object}        SNSTopic
 * @property    awsAccountId    {string}                AWS Account id to be used for operations and ARN construction. If not provided, defaults to AWS standard
 * @property    region          {Array.<string>|string} AWS Region of this table. Can be also an array of all the regions where this table should be replicated
 * @property    topicName       {string}                Name of the SNS topic
 * @property    arn             {string}                ARN representing an SNS Topic
 *
 */

/**
 * @type    {SNSTopic}
 * @param   snsTopicConfig    {SNSTopic}  Configuration object
 * @class
 */
var SNSTopic = function(snsTopicConfig) {
    snsTopicConfig.arnTemplate = "arn:aws:sns:${config.region}:${config.awsAccountId}:${config.topicName}";
    _.extend(this, new AWSResource(snsTopicConfig));

};

module.exports = SNSTopic;