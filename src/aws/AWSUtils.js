"use strict";
var AWS = require("aws-sdk");
var Promise = require("bluebird");

var AWSUtils = function() {
};


/**
 * Retrieves AWS Account ID
 * @returns {Promise}   A promise contaning a string with numeric ID of current AWS account
 */
AWSUtils.getCurrentAwsAccountId = function() {
    var _self = this;

    function getAccountId() {
        var iam = new AWS.IAM();
        return new Promise(function(resolve, reject) {
            iam.listUsers(function(err, data) {
                if (err) reject(err);
                else {
                    resolve(data);
                }
            });
        })
            . then(function(data) {
                var users = data.Users;
                var accountId = null;
                users.forEach(function(element) {
                    var newAccountId = element.Arn.split(":")[4];
                    accountId = accountId ? accountId : newAccountId;
                    if (accountId !== newAccountId) {
                        throw new Error("More than one account id found: " + accountId + " and " + newAccountId);
                    }
                });
                _self.accountId = accountId;
                return _self.accountId;
            });
    }

    if (!this.accountId)  return getAccountId();
    else return Promise.resolve(this.accountId);
};


/** Singleton **/
AWSUtils.instance = null;

AWSUtils.getInstance = function() {
    if (this.instance === null) {
        this.instance = new AWSUtils()
    }
    return this.instance;
};

//initializes object
AWSUtils.getInstance();

module.exports = AWSUtils;