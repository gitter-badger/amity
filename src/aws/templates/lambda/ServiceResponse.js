"use strict";

var _ = require("lodash");
var Promise = require("bluebird");
var Error = require("./Error");
var Validator = require("./Validator");

/**
 * Service Response module
 * @module
 */

/**
 * @typedef     {object}    ServiceResponse
 * @property    count       {number}                    Total number of available records
 * @property    lastKey     {string}                    Key of the last object returned by query
 * @property    result      {array|object|Error}        Array containing a list or single object returned by the operation //TODO: consider removing error
 * @property    params      {object}                    Object containing response specific params
 * @property    eTag        {string}                    ETag of the performed operation.
 *                                                      To be used for caching purposes and asynchronous invocation checking status of a request with a given (previousily returned ETag).
 *                                                      If null, caching is not allowed for this resource
 */

/**
 * Response to a service request, containing results and additional parameters
 * @param serviceResponse {ServiceResponse} Response object event to initialize instance
 * @class
 */
var ServiceResponse = function(serviceResponse) {
    serviceResponse = serviceResponse ? serviceResponse : {};
    _.extend(this, new Validator.Validatable());
    _.merge(this, serviceResponse);
    this.addValidators(ServiceResponse.validators);
};

ServiceResponse.validators = {};

module.exports = ServiceResponse;