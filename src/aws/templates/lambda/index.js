console.log('[${config.functionName] Function invoked ');

var _ = require("lodash");                      // Lodash library for utilities
var Promise = require("bluebird");              // Promises support

var Errors = require("./Error.js");             // Support for application-specific custom errors
var Request = require("./ServiceRequest");      // Service Request wrapper object
var Response = require("./ServiceResponse");    // Service Response wrapper object


exports.handler = function(event, context) {
    var successCallback = function(data) {
        context.succeed(data);
    };

    var errorCallback = function(error) {
        context.fail("ERROR " + JSON.stringify(error));
    };

    action(event, successCallback, errorCallback);
};

function action(event, successCallback, errorCallback) {

    /** @type {ServiceRequest} **/
    var request = new Request(event);   // Parses incoming event to a Request object, thus mapping parameters and providing some utility methods

    //TODO: insert code for ${config.function} here

    /** @type {ServiceResponse} **/
    var response = new Response();  // Creates a new response envelope to send data back to caller
    successCallback(response);
}


