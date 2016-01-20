"use strict";
var _ = require("lodash");

var AWSResource = require("./AWSResource");

/**
 * A resource object representing an S3 Bucket
 * @typedef     {object}        S3Bucket
 * @property    awsAccountId    {string}                AWS Account id to be used for operations and ARN construction. If not provided, defaults to AWS standard
 * @property    region          {Array.<string>|string} AWS Region of this table. Can be also an array of all the regions where this table should be replicated
 * @property    baseKey         {string}                Path prefix to be prepended to every object save/retrieved.
 * @property    arn             {sting}                 ARN representing a Bucket
 */

/**
 * @type    {S3Bucket}
 * @param   s3BucketConfig    {S3Bucket}  Configuration object
 * @class
 */
var S3Bucket = function(s3BucketConfig) {

    s3BucketConfig.arnTemplate = "arn:aws:s3:::${config.name}/${config.baseKey}";
    _.extend(this, new AWSResource(s3BucketConfig));
};

module.exports = S3Bucket;