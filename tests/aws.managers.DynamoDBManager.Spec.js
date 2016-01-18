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
    READ_THROUGHPUT: 2,
    WRITE_THROUGHPUT: 1
};


describe("DynamoDBManager", function() {
    var DynamoDBManager = require("../src/aws/managers/DynamoDBManager");
    var DynamoDBTable = require("../src/aws/resources/DynamoDBTable");

    var tableName;
    var expectedResponse;
    var dynamoMock;

    beforeEach(function() {
        tableName = "jasmine-test-table";
        expectedResponse = require(CONST.FIXTURE_PATH + "/managers/dynamoManagerResponse.json");
        dynamoMock = AWSPromise.promisifyClient(new AWS.DynamoDB({region: testRegion}));
    });

    function intializeTest() {
        return AWSUtils.getCurrentAwsAccountId()
            .then(function(accountId) {
                    return new DynamoDBTable({
                        name: tableName,
                        awsAccountId: accountId,
                        readThroughput: CONST.READ_THROUGHPUT,
                        writeThroughput: CONST.WRITE_THROUGHPUT,
                        region: testRegion
                    })
                }
            )
    }

    describe("tries to create resources, when table", function() {

        describe("exists", function() {
            beforeEach(function() {
                tableName = "jasmine-test-table-" + (new Date().getTime());
                expectedResponse = JSON.parse(fs.readFileSync(CONST.FIXTURE_PATH + "/managers/dynamoManagerResponse.json"))["describeTableOK"];

                spyOn(dynamoMock, "describeTableAsync").andReturn(Promise.resolve(expectedResponse));
                spyOn(dynamoMock, "updateTableAsync").andReturn(Promise.resolve());
                spyOn(dynamoMock, "createTableAsync").andReturn(Promise.resolve());
                spyOn(dynamoMock, "deleteTableAsync").andReturn(Promise.resolve());
            });

            it("does nothing", function(done) {
                intializeTest()
                    .then(function(table) {
                        return DynamoDBManager.createResource(table, dynamoMock)
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
                tableName = "jasmine-test-table-" + (new Date().getTime());
                expectedResponse = JSON.parse(fs.readFileSync(CONST.FIXTURE_PATH + "/managers/dynamoManagerResponse.json"))["describeTableThroughput"];

                spyOn(dynamoMock, "describeTableAsync").andReturn(Promise.resolve(expectedResponse));
                spyOn(dynamoMock, "updateTableAsync").andReturn(Promise.resolve());
                spyOn(dynamoMock, "createTableAsync").andReturn(Promise.resolve());
                spyOn(dynamoMock, "deleteTableAsync").andReturn(Promise.resolve());
            });

            it("does nothing", function(done) {
                intializeTest()
                    .then(function(table) {
                        return DynamoDBManager.createResource(table, dynamoMock)
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
                expectedResponse = JSON.parse(fs.readFileSync(CONST.FIXTURE_PATH + "/managers/dynamoManagerResponse.json"))["describeTableERROR"];

                spyOn(dynamoMock, "describeTableAsync").andReturn(Promise.reject(expectedResponse));
                spyOn(dynamoMock, "updateTableAsync").andReturn(Promise.resolve());
                spyOn(dynamoMock, "createTableAsync").andReturn(Promise.resolve());
                spyOn(dynamoMock, "deleteTableAsync").andReturn(Promise.resolve());
            });

            it("creates them", function(done) {
                intializeTest()
                    .then(function(table) {
                        return DynamoDBManager.createResource(table, dynamoMock)
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
            expectedResponse = JSON.parse(fs.readFileSync(CONST.FIXTURE_PATH + "/managers/dynamoManagerResponse.json"))["describeTableOK"];

            spyOn(dynamoMock, "describeTableAsync").andReturn(Promise.resolve(expectedResponse));
            spyOn(dynamoMock, "updateTableAsync").andReturn(Promise.resolve());
            spyOn(dynamoMock, "createTableAsync").andReturn(Promise.resolve());
            spyOn(dynamoMock, "deleteTableAsync").andReturn(Promise.resolve());
        });
        it("existing resources", function(done) {
            intializeTest()
                .then(function(table) {
                    return DynamoDBManager.deleteResource(table, dynamoMock)
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