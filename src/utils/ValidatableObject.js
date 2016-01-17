"use strict";
var _ = require("lodash");

var ValidatableObject = function() {
    this.errors = [];
    this.validators = {};

    this.validate = function(validatorSubset) {
        var validators = validatorSubset ? validatorSubset : ValidatableObject.validators;

        for (var key in validators) {
            if (validators.hasOwnProperty(key)) {
                var validator = new validators[key](this);
                if (validator.validate() !== true) this.errors.concat(validator.errors);
            }
        }
        return _.isEmpty(this.errors);
    };

    this.addValidators = function(validatorsObject) {
        if (!_.isPlainObject(validatorsObject)) throw new Error("Validator object should be a plain object.");
        _.merge(this.validators, validatorsObject);
    };

    this.addValidator = function(validatorName, validatorFunction) {
        if (!_.isFunction(validatorFunction)) throw new Error("Validator function should be a function.");
        this.validators[validatorName] = validatorFunction;
    };

    this.removeAllValidators = function() {
        this.validators = {};
    };

    this.removeValidator = function(validatorName) {
        delete this.validators[validatorName];
    };

    this.clearValidationErrors = function() {
        this.errors = [];
    }
};

module.exports = ValidatableObject;