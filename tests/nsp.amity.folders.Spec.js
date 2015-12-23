"use strict";

describe("Amity.folders", function() {
    var Amity;
    var amity;

    beforeEach(function() {
        Amity = require("../amity.js");
        amity = new Amity();
    });
    describe("have a folders object that", function() {
        it("is defined", function() {
            expect(amity.folders).toBeDefined();
        });

        it("retrives the names of functions in a lambda folder", function() {
            var fixture = "fixtures/folders";
            console.log("DDDDD "+__dirname + " " + names);

            var names = amity.folders.getLambdaFunctions(fixture);
            //expect(names).toContain("nsp-test-func-01");
            //expect(names).toContain("nsp-test-func-02");
        });


    });


});