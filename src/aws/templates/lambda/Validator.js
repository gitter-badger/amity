"use strict";
var _ = require("lodash");


/**
 * Validation error. Extends Generic Error class.
 * @typedef     {object}    ValidationError
 * @extends {GenericError}
 * @param errorMessage      {string}    Human readable message for this error. Can be a template for messageParameters object, by providing a string with ${} placeholders
 * @param errorReference    {object}    Reference to object that produced this error
 * @param messageParameters {object}    Map containing parameres relevanti to this object
 * @class
 */
var ValidationError = function(errorMessage, errorReference, messageParameters) {
    _.extend(this, new GenericError(errorMessage, errorReference, messageParameters));
    this.type = "Error:Validation";
};

/**
 * Abstract Validator class
 * @class
 */
var Validator = function() {

    /** @type {Array.<ValidationError>} **/
    this.errors = [];

    /**
     * Executes validator specific logic
     * @abstract
     * @returns {boolean}   validation
     */
    this.validate = function() {
        throw new Error("Validator's validate() function must be implemented in a child class.");
    };
};

/**
 * Superclass for objects that provide validation capabilities. Validators aim being set as static functions to JS objects, in order to be easily testable and extensible. Since each child object
 * should define its own specific validator, the goal of this class is to provide an abstraction layer to manage validation and return a set of validation errors.
 * @class
 */
var Validatable = function() {

    /** @type {Array.<ValidationError>} **/
    this.errors = [];

    /** @type {Array.<Validator>} **/
    this.validators = {};

    /**
     * Loops over validators array, instantiates each of them and calls its validate() method. This method can be invoked with aa param selecting a subset of validators to run. Errors are
     * stacked in errors array
     * @param validatorSubset   {Array.<Validator>}
     * @returns {boolean}       Validation status. True if no errors occured.
     */
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

    /**
     * Adds a set of validators to existing. If any already exists, then overwrites with the provided one.
     * @param validatorsObject  {object}    A map containing the validators that have to be added
     */
    this.addValidators = function(validatorsObject) {
        if (!_.isPlainObject(validatorsObject)) throw new Error("Validator object should be a plain object.");
        _.merge(this.validators, validatorsObject);
    };

    /**
     * Adds a single validator function to the set of validators
     * @param name      {string}    The name fo this validator. If a validator with the same name altready exists it is overwritten.
     * @param validator {Validator}  The validator function that has to be added.
     */
    this.addValidator = function(name, validator) {
        if (!_.isFunction(validator)) throw new Error("Validator function should be a function.");
        this.validators[name] = validator;
    };

    /**
     * Resets all the validators list.
     */
    this.removeAllValidators = function() {
        this.validators = {};
    };

    /**
     * Removes a specific validator from the list. If it does not exist, no operation is performed.
     * @param validatorName {string}    Name of the validator that should be removed.
     */
    this.removeValidator = function(validatorName) {
        delete this.validators[validatorName];
    };

    /**
     * Resets the validation status and all the errors.
     */
    this.clearValidationErrors = function() {
        this.errors = [];
    }
};

module.exports = {
    Validatable: Validatable,
    ValidationError: ValidationError,
    Validator: Validator
};