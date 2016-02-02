"use strict";
var version = "0.2.0";
var fs = require("fs");
var path = require("path");
var del = require("del");

var CONST = {
    AMITY_SRC_PATH: "../src",
    FIXTURE_PATH: "/fixtures"
};

describe("Amity", function() {
    var Amity;

    beforeEach(function() {
        Amity = require(CONST.AMITY_SRC_PATH + "/amity.js");
    });

    describe("library is", function() {
        it("defined", function() {
            expect(Amity).toBeDefined();
        });

        it("of version " + version, function() {
            expect(Amity.version).toBe(version);
        });

        it("instantiable", function() {
            var instance = new Amity();
            expect(instance).toBeDefined();
            expect(instance).not.toBeNull();
        });
    });

    describe("amity object", function() {
        var amity;
        beforeEach(function() {
            amity = new Amity();
        });

        describe("when instantiated", function() {
            describe("with base directory param only", function() {
                it("recovers resource config files in sub directories and builds a config object", function() {
                    expect(true).toBeTruthy(); //TODO: implement test
                });
                it("saves a project config folder ")
            });
            describe("with base directory and existing project config file params", function() {
                it("recovers resource config files in sub directories and joins them to the project config", function() {
                    expect(true).toBeTruthy(); //TODO: implement test
                });
            });
        });
        describe("validates project configuration", function() {
            it("failing if no resources are provided", function() {
                expect(true).toBeTruthy(); //TODO: implement test
            });
        });
        describe("initializes project folder", function() {
            var basePath = __dirname + CONST.FIXTURE_PATH + "/project/empty_folder";

            function getDirectories(path) {
                return fs.readdirSync(path).filter(function(file) {
                    return fs.statSync(path + '/' + file).isDirectory();
                });
            }

            afterEach(function() {
                del(basePath + "/**/*");    // cleans created folders
                del(basePath + "/.*");      // cleans files begininning with dot, such as amity project file
            });

            it("creating it if does not exist", function() {
                var APF = require(CONST.AMITY_SRC_PATH + "/AmityProjectFolders");
                var folders = new APF();

                expect(getDirectories(basePath)).toEqual([]);
                amity.init(basePath)
                    .then(function() {
                        var createdFolders = getDirectories(basePath);
                        expect(createdFolders).toContain(folders.code);
                        expect(createdFolders).toContain(folders.cloud);
                    });
            });
            it("creating only missing folders", function() {
                expect(true).toBeTruthy(); //TODO: implement test
            });
            it("failing if project name is not provided in config or as option", function() {

            });
        });
        describe("collect resources descriptiors from files", function() {
            var basePath = __dirname + CONST.FIXTURE_PATH + "/project/with_sub_folders";
            var expected = JSON.parse(fs.readFileSync(path.join(__dirname + CONST.FIXTURE_PATH, "amityCollectFixture.json")));

            it("filling resources in config file", function(done) {
                amity.collectConfigFiles(basePath, null)
                    .then(function(config) {
                        var actual = amity.config.resources;
                        for (var k in actual) {                                                 // loop on every service in resources
                            if (actual.hasOwnProperty(k)) {
                                expect(actual[k].length).toBe(expected.resources[k].length);    // tests have the same length
                                expected.resources[k].forEach(function(element) {               // for each element of one of them
                                    expect(actual[k]).toContain(element);                       // check it is contained in the other
                                });                                                             // Implementing equality check without considering
                                                                                                // element position

                            }
                        }
                        done();
                    });
            });
        });
    });

});