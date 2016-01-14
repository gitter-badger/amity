"use strict";

describe("Amity AWS Resources", function() {
    describe("AWSResource", function() {
        var AWSResource = require("../aws/resources/AWSResource.js");

        it("cannot be initialized with an undefined config object.", function() {
            expect(function() {
                new AWSResource()
            }).toThrow(new Error("AWS Account id not defined in configuration"));
        });
        it("cannot be initialized with an empty config object.", function() {
            expect(function() {
                new AWSResource({})
            }).toThrow(new Error("AWS Account id not defined in configuration"));
        });
        it("cannot be initialized with an object not providing aws account id.", function() {
            expect(function() {
                new AWSResource({property01: "myProp", property02: "myNewProp"})
            }).toThrow(new Error("AWS Account id not defined in configuration"));
        });
        it("initializes correctly when aws account id is provided", function() {
            expect(new AWSResource({awsAccountId: "032323032"})).toBeDefined();
        });
    });
});
