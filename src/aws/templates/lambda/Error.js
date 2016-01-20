"use strict";
var _ = require("lodash");

/**
 * @module
 */

function uuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + "-" + s4() + "-" + s4() + "-" + s4();
}

/**
 * Error envelope to manage service response errors. Supports a collection of GenericError children
 * @param errorCode
 * @param errorMessage
 */
var requestError = function(errorCode, errorMessage) {
    this.statusCode = errorCode;
    this.type = "ErrorServer";
    this.message = errorMessage;
    this.uri = "";
    this.errors = [];
    this.timestamp = new Date();

    var _self = this;
    this.hasErrors = function() {
        return (_self.errors.length > 0);
    };
};


/**
 * Generic error class. It is throwable.
 * @typedef     {object}    GenericError
 * @param errorMessage      {string}    Human readable message for this error. Can be a template for messageParameters object, by providing a string with ${} placeholders
 * @param errorReference    {object}    Reference to object that produced this error
 * @param messageParameters {object}    Map containing parameres relevanti to this object
 * @class
 */
var GenericError = function(errorMessage, errorReference, messageParameters) {
    _.extend(this, new Error(errorMessage));
    this.uuid = uuid();
    this.reference = errorReference;
    this.type = "Error:Generic";
    this.parameters = messageParameters;
};


module.exports = {
    GenericError: GenericError,
    ServerError: ServerError
};
