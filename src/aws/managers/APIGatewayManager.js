"use strict";
var _ = require("lodash");
var Promise = require("bluebird");
var Handlebars = require("handlebars");
var APIEndpoint = require("../resources/APIEndpoint");

/**
 * @module
 */

var CONST = {
    SWAGGER_TEMPLATE: "../templates/apigateway/gateway-swagger.js"
};
