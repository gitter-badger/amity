"use strict";
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var path = Promise.promisifyAll(require("path"));

/**
 * @typedef {object} AmityProjectFolders
 * @property    code    {string}    Code folder. Contains lambda and webapp code.
 * @property    cloud   {string}    Cloud resources folder
 * @property    lamba   {string}    Folder where are contained all project lambda functions.
 * @property    webapp  {string}    Folder where all webclient code is contained
 * @property    test    {string}    Test folder for this project
 * @property    dist    {string}    Project released components distribution folder
 */

/**
 * Folder Manager for Amity project.
 * @type {AmityProjectFolders}
 * @class
 */
var Folders = function() {
    this.code = "code";
    this.cloud = "cloud";
    this.lambda = this.code + "/lambda";
    this.webapp = this.code + "/web";
    this.test = "test";
    this.dist = "dist";

    this.readyToPackage = this.dist + "/dev";
    this.readyToUpload = this.dist + "/prod";


    /**
     * Retrieves the list of lambda functions for this project.
     * @param dir   Directory containing lambda functions
     * @returns {Array.<string>}    A list of lambda functions
     */
    this.getLambdaFunctions = function(dir) {
        return fs.readdirAsync(dir)
            .filter(function(file) {
                return fs.statSync(path.join(dir, file)).isDirectory();
            });
    };

    /**
     * Creates folders required by Amity following convention.
     * @param baseDir   {string}    Base directory of this project
     */
    this.setupProjectFolders = function(baseDir) {
        if (baseDir === undefined) baseDir = "./";
        var directories = [
            path.join(baseDir, this.code),
            path.join(baseDir, this.cloud),
            path.join(baseDir, this.lambda),
            path.join(baseDir, this.webapp),
            path.join(baseDir, this.test),
            path.join(baseDir, this.dist)
        ];

        var promises = [];
        directories.forEach(function(element) {
            try {
                promises.push(fs.mkdirAsync(element));
            } catch (e) {
                if (e.code != 'EEXIST') throw e;
            }
        });
        return Promise.all(promises);
    };

};

module.exports = Folders;