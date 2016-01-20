"use strict";

var _ = require("lodash");
var Promise = require("bluebird");
var Error = require("./Error");
var Validator = require("./Validator");

/**
 * Service Request module
 * @module
 */

/**
 * @typedef     {object}    ServiceRequest
 * @property    operation   {Operation} HTTP Method of this request
 * @property    apiVersion  {string}    Version of invoked APIs
 * @property    objectKey   {string}    Key of a specific object
 * @property    body        {object}    Request body, usuallt a JSON data
 * @property    identity    {object}    Object containing credentials
 * @property    sort        {string}    Comma-separated list of attributes to be used for data sorting
 * @property    fields      {string}    Comma-separated list of attrivutes to be included in the response
 * @property    embed       {string}    Comma-separated attributes to be expanded and embedded into response object
 * @property    startKey    {string}    Last element key to be used as starting point for dynamic result page construction
 * @property    offset      {string}    Number of results to be returned from this request. Ignored if method != GET //TODO: rename as limit
 * @property    params      {object}    Object containing request-specific params
 * @property    q           {string}    Full-text search query string. Ignored in opertations other than list or query  //TODO: evaluate if necessary
 */

/**
 *
 * @param serviceRequest {ServiceRequest}
 * @type {ServiceRequest}
 * @class
 */
var ServiceRequest = function(serviceRequest) {
    _.extend(this, new Validator.Validatable());
    _.merge(this, serviceRequest);

    this.fieldsArray = serviceRequest.fields ? serviceRequest.fields.split(",") : null;
    this.sortArray = serviceRequest.sort ? serviceRequest.sort.split(",") : null;
    this.embedArray = serviceRequest.embed ? serviceRequest.embed.split(",") : null;


    this.addValidators(ServiceRequest.validators);
};


ServiceRequest.validators = {};

/**
 * Check request is an object
 * @param request {ServiceRequest}  Request Object to be validated
 */
ServiceRequest.validators.validateObject = function(request) {
    this.errors = [];
    this.validate = function() {
        if (!_.isObject(request)) {
            this.push(new Error.ValidationError("Request Object is NotDefined or Null"));
        }
        return (this.errors !== null);
    };
};

/**
 * Check operation is valid
 * @param request {ServiceRequest}  Request Object to be validated
 */
ServiceRequest.validators.validateOperation = function(request) {
    this.errors = [];
    this.validate = function() {
        var error;
        if (request) {
            var operation = request.operation;
            if ((!operation) ||
                (operation !== "get") ||
                (operation !== "list") ||
                (operation !== "insert") ||
                (operation !== "update") ||
                (operation !== "delete")
            ) {
                this.errors.push(new Error.ValidationError("Operation should be defined and one of get, list, insert, update, delete"));
            }
        }
        return (this.errors !== null)
    };
};


module.exports = ServiceRequest;