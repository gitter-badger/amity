"use strict";
var Folders = require("./AmityProjectFolders");

/**
 * Object representing all te patterns required by Amity
 * @param   baseFolders {AmityProjectFolders}
 */
var Patterns = function(baseFolders) {

    this.getAllPattern = function() {
        return "/**/*";
    };

    this.getLambdaPattern = function(functionFolder, excludeTests) {
        var path = functionFolder !== undefined ? functionFolder : baseFolders.lamba;

        excludeTests = excludeTests !== undefined ? excludeTests : false;
        var pattern = [
            path + "/**/*",
            "!" + path + "/**/node_modules/aws-sdk/**/*",   // exclude AWS SDK files (already included in lambda)
            "!" + path + "/**/node_modules/aws-sdk",        // exclude AWS SDK folder
            "!" + path + "/**/node_modules/**/*min.js",     // exclude minified version of libraries so can minify the rest
            "!" + path + "/**/node_modules/**/*.map",       // exclude sourcemaps that are not relevant
            "!" + path + "/**/*package.json"
        ];
        if (excludeTests) {
            pattern = pattern.concat([
                "!" + path + "/test/**/*",                          // exclude test folder
                "!" + path + "/test",                          // exclude test folder
                "!" + path + "/**/test*.json",                    // exclude test events
                "!" + path + "/**/test*.js"                      // exclude test files
            ]);
        }
        return pattern;
    };
    this.getTestsPattern = function() {
        return baseFolders.lambda + "/**/*[S|s]pec.js"
    };
};

module.exports = Patterns;