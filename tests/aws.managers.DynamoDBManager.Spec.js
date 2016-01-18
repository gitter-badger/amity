"use strict";
var Promise = require("bluebird");
var fs = require("fs");

var AWS = require("aws-sdk");
var AWSUtils = require("../src/aws/AWSUtils");
var testRegion = "us-east-1";
var AWSPromise = require("../src/aws/AWSPromise");


var CONST = {
    CURRENT_PATH: __dirname,
    FIXTURE_PATH: __dirname + "/fixtures",
};


describe("DynamoDBManager", function() {
    var DynamoDBManager = require("../src/aws/managers/DynamoDBManager");
    var DynamoDBTable = require("../src/aws/resources/DynamoDBTable");

    var fixtureConfig;
    var expectedResponse;
    var dynamoMock;

    beforeEach(function() {
        fixtureConfig = JSON.parse(fs.readFileSync(CONST.FIXTURE_PATH + "/managers/dynamoDBManager_configs.json"));

        expectedResponse = require(CONST.FIXTURE_PATH + "/managers/dynamoDBManager_responses.json");
        dynamoMock = AWSPromise.promisifyClient(new AWS.DynamoDB({region: testRegion}));
    });

    function intializeTest() {
        return AWSUtils.getCurrentAwsAccountId()
            .then(function(accountId) {
                    fixtureConfig.awsAccountId = accountId;
                    return new DynamoDBTable(fixtureConfig)
                }
            )
    }

    describe("tries to create resources, when table", function() {

        describe("exists", function() {
            beforeEach(function() {
                expectedResponse = JSON.parse(fs.readFileSync(CONST.FIXTURE_PATH + "/managers/dynamoDBManager_responses.json"))["describeTableOK"];

                spyOn(dynamoMock, "describeTableAsync").andReturn(Promise.resolve(expectedResponse));
                spyOn(dynamoMock, "updateTableAsync").andReturn(Promise.resolve());
                spyOn(dynamoMock, "createTableAsync").andReturn(Promise.resolve());
                spyOn(dynamoMock, "deleteTableAsync").andReturn(Promise.resolve());
            });

            it("does nothing", function(done) {
                intializeTest()
                    .then(function(table) {
                        return DynamoDBManager.createResource(fixtureConfig, dynamoMock)
                    })
                    .then(function() {
                        expect(dynamoMock.describeTableAsync).toHaveBeenCalled();
                        expect(dynamoMock.updateTableAsync).not.toHaveBeenCalled();
                        expect(dynamoMock.createTableAsync).not.toHaveBeenCalled();
                        expect(dynamoMock.deleteTableAsync).not.toHaveBeenCalled();
                        done();
                    });
            });
        });

        describe("exists but has the wrong throughput", function() {
            beforeEach(function() {
                expectedResponse = JSON.parse(fs.readFileSync(CONST.FIXTURE_PATH + "/managers/dynamoDBManager_responses.json"))["describeTableThroughput"];

                spyOn(dynamoMock, "describeTableAsync").andReturn(Promise.resolve(expectedResponse));
                spyOn(dynamoMock, "updateTableAsync").andReturn(Promise.resolve());
                spyOn(dynamoMock, "createTableAsync").andReturn(Promise.resolve());
                spyOn(dynamoMock, "deleteTableAsync").andReturn(Promise.resolve());
            });

            it("does nothing", function(done) {
                intializeTest()
                    .then(function(table) {
                        return DynamoDBManager.createResource(fixtureConfig, dynamoMock)
                    })
                    .then(function() {
                        expect(dynamoMock.describeTableAsync).toHaveBeenCalled();
                        expect(dynamoMock.updateTableAsync).toHaveBeenCalled();
                        expect(dynamoMock.createTableAsync).not.toHaveBeenCalled();
                        expect(dynamoMock.deleteTableAsync).not.toHaveBeenCalled();
                        done();
                    });
            });
        });


        describe("does not exist", function() {
            beforeEach(function() {
                expectedResponse = JSON.parse(fs.readFileSync(CONST.FIXTURE_PATH + "/managers/dynamoDBManager_responses.json"))["describeTableERROR"];

                spyOn(dynamoMock, "describeTableAsync").andReturn(Promise.reject(expectedResponse));
                spyOn(dynamoMock, "updateTableAsync").andReturn(Promise.resolve());
                spyOn(dynamoMock, "createTableAsync").andReturn(Promise.resolve());
                spyOn(dynamoMock, "deleteTableAsync").andReturn(Promise.resolve());
            });

            it("creates them", function(done) {
                intializeTest()
                    .then(function(table) {
                        return DynamoDBManager.createResource(fixtureConfig, dynamoMock)
                    })
                    .then(function() {
                        expect(dynamoMock.describeTableAsync).toHaveBeenCalled();
                        expect(dynamoMock.updateTableAsync).not.toHaveBeenCalled();
                        expect(dynamoMock.createTableAsync).toHaveBeenCalled();
                        expect(dynamoMock.deleteTableAsync).not.toHaveBeenCalled();
                        done();
                    });
            });
        });
    });


    describe("deletes", function() {
        beforeEach(function() {
            expectedResponse = JSON.parse(fs.readFileSync(CONST.FIXTURE_PATH + "/managers/dynamoDBManager_responses.json"))["describeTableOK"];

            spyOn(dynamoMock, "describeTableAsync").andReturn(Promise.resolve(expectedResponse));
            spyOn(dynamoMock, "updateTableAsync").andReturn(Promise.resolve());
            spyOn(dynamoMock, "createTableAsync").andReturn(Promise.resolve());
            spyOn(dynamoMock, "deleteTableAsync").andReturn(Promise.resolve());
        });
        it("existing resources", function(done) {
            intializeTest()
                .then(function(table) {
                    return DynamoDBManager.deleteResource(fixtureConfig, dynamoMock)
                })
                .then(function() {
                    expect(dynamoMock.describeTableAsync).not.toHaveBeenCalled();
                    expect(dynamoMock.updateTableAsync).not.toHaveBeenCalled();
                    expect(dynamoMock.createTableAsync).not.toHaveBeenCalled();
                    expect(dynamoMock.deleteTableAsync).toHaveBeenCalled();
                    done();
                });
        });
    });

});