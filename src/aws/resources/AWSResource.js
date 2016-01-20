"use strict";
var _ = require("lodash");

/**
 * A resource object representing an AWSResource
 * @typedef     {object}        AWSResource
 * @property    awsAccountId    {string}                AWS Account id to be used for operations and ARN construction. If not provided, defaults to AWS standard
 * @property    region          {Array.<string>|string} AWS Region
 * @property    resourceName    {string}                Unique current name of the resource (for this type)
 * @property    arn             {sting}                 ARN representing the resource
 * @property    arnTemplate     {string}                Template of ARN corresponding to this resource type
 */

/**
 * @type {AWSResource}
 * @param configObject  {AWSResource}   Configuration object
 * @class
 */
var AWSResource = function(configObject) {
    _.merge(this, configObject);
    if (!this.awsAccountId) throw new Error("AWS Account id not defined in configuration");
    var arnTemplate = _.template(configObject.arnTemplate);

    /**
     * From resource project unique name retrurns its ARN
     * @param   name        Resource name
     * @returns {string}    ARN representing this resource
     */
    this.nameToArn = function(name) {
        var templateData = {};
        _.merge(templateData, this);
        if (name) templateData.name = name;
        var data = {
            config: templateData
        };
        return arnTemplate(data);
    };

    /**
     * Extract resource name from ARN
     * @param   arn         ARN of the resource
     * @returns {string}    Name of the resource
     */
    this.arnToName = function(arn) {
        var string = "${config.name}";
        var match = arnTemplate.split(":");
        var nameIndex = -1;
        for (var i = 0; i < match.length; i++) {
            if (match[i] === string) nameIndex = i;
        }
        if (nameIndex < 0) throw new Error("Resource placeholder not found in ARN template. Check template for ${config.name}");
        return arn.split(":")[nameIndex];
    };


    if (!this.arn) {
        this.arn = this.nameToArn();
    }
};


module.exports = AWSResource;