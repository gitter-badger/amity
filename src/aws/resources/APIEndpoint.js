"use strict";
var _ = require("lodash");
var AWSResource = require("./AWSResource");

/**
 * @module
 */


/**
 * @typedef     {object}        APIEndpoint
 * @extends     AWSResource
 * @property    type            {string}                Type of the service managing data coming from this REST call. Currently only 'lambda' is supported
 * @property    path            {string}                Path to be assigned to this REST resource
 * @property    method          {string}                HTTP verb to be supported by this endpoint. Available options are GET|PUT|POST|DELETE|OPTIONS
 * @property    auth            {object}                Authorization object guarding this endpoint
 * @property    iamRole         {string}                IAM authorization role
 * @property    apiKey          {boolean}               Sets whether an API Key is required or not
 * @property    queryParams     {Array.<string>}        Array of objects containing names of the parameters expected in a query string
 * @property    headers         {Array,<string, string>}    Array of strings representing supported headers to be exposed
 * @property    integration     {APIGatewayIntegration} API Gateway integration template (mapping to "x-amazon-apigateway-integration" attribute in Swagger file)
 */

/**
 * @typedef     {object}    APIGatewayIntegration
 * @property    credentials             {string}                Lambda Execution Role ARN
 * @property    requestTemplates        {object.<string,string>}    Integration template of the request. The key is in the form of a mime type (i.e. application/json) and the value is a string
 *                                                                  containing the Velocity template to be used when dealing with a request of that mime type.
 * @property    requestParameters       {Object.<string,string>}    List of mapping for request parameters. Each key can start in the form "integration.request.(path|querystring).<PARAM_NAME>" and
 *                                                                  receive values from mappings in the form "method.request.querystring
 */



/**
 * Resource mapping to a Lambda function
 * @param apiConfig  {APIEndpoint}    Configuration object
 * @class
 */
var APIEndpoint = function(apiConfig) {
    apiConfig.arnTemplate = "arn:aws:apigateway:${config.region}::${config.path}";
    _.extend(this, new AWSResource(apiConfig));


};

module.exports = APIEndpoint;