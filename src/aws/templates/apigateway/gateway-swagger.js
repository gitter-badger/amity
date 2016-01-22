"use strict";
var _ = require("lodash");

/**
 * API Integration object serializer
 * @param apiEndpoint   {APIEndpoint}   Configuration object
 * @class
 */
var APIIntegrationObject = function(apiEndpoint) {
    this.type = apiEndpoint.type;
    this.uri = apiEndpoint.arn,
    this.httpMethod = apiEndpoint.type === "aws" ? "POST" : apiEndpoint.method;

        this.credentials = apiEndpoint.iamRole;
    this.requestTemplates =  {};
    for(var key in apiEndpoint.integration.requestTemplates) {
        if(apiEndpoint.integration.requestTemplate.hasOwnProperty(key)) {
            this.requestTemplates[key] = apiEndpoint.integration.requestTemplate[key];
        }
    }
this.requestParameters = {};
for(var key in this.methor)
    "requestParameters" : {
        {{#each headers}}
        "integration.request.header.{{this}}" : "method.request.header.{{this}}"{{#unless $last}},{{/unless}}
        {{/each}}
    "integration.request.path.integrationPathParam" : "method.request.querystring.latitude",
        "integration.request.querystring.integrationQueryParam" : "method.request.querystring.longitude"
},
    "cacheNamespace" : "cache-namespace",
    "cacheKeyParameters" : [],
    "responses" : {
    "2\\d{2}" : {
        "statusCode" : "200",
            "responseParameters" : {
            "method.response.header.test-method-response-header" : "integration.response.header.integrationResponseHeaderParam1"
        },
        "responseTemplates" : {
            "application/json" : "json 200 response template",
                "application/xml" : "xml 200 response template"
        }
    },
    "default" : {
        "statusCode" : "400",
            "responseParameters" : {
            "method.response.header.test-method-response-header" : "'static value'"
        },
        "responseTemplates" : {
            "application/json" : "json 400 response template",
                "application/xml" : "xml 400 response template"
        }
    }
}
