"use strict";
var _ = require("lodash");

/**
 * A resource object representing an AWSResource
 * @typedef     {object}        AWSResource
 * @property    awsAccountId    {string}                AWS Account id to be used for operations and ARN construction. If not provided, defaults to AWS standard
 * @property    region          {Array.<string>|string} AWS Region
 * @property    arn             {sting}                 ARN representing the resource
 */

/**
 * @type {AWSResource}
 * @param configObject  {AWSResource}   Configuration object
 * @class
 */
var AWSResource = function(configObject) {
    _.merge(this, configObject);
    console.log("Caller "+this.caller);
    if (!this.awsAccountId) throw new Error("AWS Account id not defined in configuration");
    if (!this.arn) {
        var arnTemplate = _.template(configObject.arnTemplate);
        var data = {
            config:configObject
        };
        this.arn = arnTemplate(data);
    }
};


module.exports = AWSResource;