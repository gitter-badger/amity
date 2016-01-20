"use strict";
var fs = require("fs");
var mkdirp = require("mkdirp");
var del = require("del");

var AWS = require("aws-sdk");
var AWSUtils = require("../src/aws/AWSUtils");
var AWSPromise = require("../src/aws/AWSPromise");

var CONST = {
    MANAGERS_PATH_: "../src/aws/managers",
    RESOURCES_PATH_: "../src/aws/resources",
    CURRENT_PATH: __dirname,
    FIXTURE_PATH: __dirname + "/fixtures"
};

describe("LambdaManager", function() {
    var LambdaManager = require(CONST.MANAGERS_PATH_ + "/LambdaManager");
    var Lambda = require(CONST.RESOURCES_PATH_ + "/Lambda");

    describe(".initResource() creates lambda resource from template", function() {

        var testDir;

        /** @type {Lambda} **/
        var lambdaConfig;

        /** @type {Lambda} **/
        var fixtureConfig;

        function intializeTest() {
            return AWSUtils.getCurrentAwsAccountId()
                .then(function(accountId) {
                        fixtureConfig.awsAccountId = accountId;
                        return new Lambda(fixtureConfig)
                    }
                )
        }

        beforeEach(function() {
            testDir = CONST.CURRENT_PATH + "/LambdaManagerTest";
            fixtureConfig = JSON.parse(fs.readFileSync(CONST.FIXTURE_PATH + "/managers/LambdaManager_configs.json"));
            mkdirp(testDir);
        });

        it("initializes NPM project", function(done) {
            intializeTest()
                .then(function() {
                    lambdaConfig = new Lambda(fixtureConfig);
                    return LambdaManager.initResource(lambdaConfig, testDir);
                })
                .then(function() {
                    expect(
                        function() {
                            fs.readFileSync(testDir + "/package.json");
                        }).not.toThrow();
                })
                .then(function() {
                    var project;
                    try {
                        project = JSON.parse(fs.readFileSync(testDir + "/package.json"));
                        done();
                        expect(project.name).toBe(fixtureConfig.name);
                    } catch (e) {
                        fail("" + JSON.stringify(e));
                    }

                });
        });

        it("install dependencies", function() {
            intializeTest()
                .then(function() {
                    lambdaConfig = new Lambda(fixtureConfig);
                    return LambdaManager.initResource(lambdaConfig, testDir);
                });
        });


        it("copies template files", function() {

        });


        afterEach(function() {
            //del(testDir);
        })

    });

});