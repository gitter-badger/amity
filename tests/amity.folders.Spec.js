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

        describe("has a method", function() {
            it("to retrieve the names of functions in a lambda folder", function() {
                var fixture = __dirname + "/fixtures/folders";

                var names = amity.folders.getLambdaFunctions(fixture);
                expect(names).toContain("nsp-test-func-01");
                expect(names).toContain("nsp-test-func-02");
            });

            describe("to setup project folders", function() {
                var fs = require("fs");
                var rimraf = require("rimraf");
                var basePath = __dirname + "/testFolderCreation";

                beforeEach(function(){
                    try {
                        fs.mkdirSync(basePath);
                    } catch (e) {
                        if (e.code != 'EEXIST') throw e;
                    }
                });

                it("within a base path", function(){
                    amity.folders.setupProjectFolders(basePath);
                    expect(fs.existsSync(basePath + "/" + amity.folders.code)).toBeTruthy();
                    expect(fs.existsSync(basePath + "/" + amity.folders.cloud)).toBeTruthy();
                    expect(fs.existsSync(basePath + "/" + amity.folders.dist)).toBeTruthy();
                    expect(fs.existsSync(basePath + "/" + amity.folders.test)).toBeTruthy();
                    expect(fs.existsSync(basePath + "/" + amity.folders.lambda)).toBeTruthy();
                    expect(fs.existsSync(basePath + "/" + amity.folders.webapp)).toBeTruthy();
                });

                afterEach(function(){
                    rimraf(basePath,{},function(){});
                });
            });

        });


    });


});