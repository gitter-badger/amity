"use strict";

describe("Amity.patterns", function() {
    var Amity;
    var amity;

    beforeEach(function() {
        Amity = require("../amity.js");
        amity = new Amity();
    });
    describe("have a patterns object that", function() {
        it("is defined", function() {
            expect(amity.patterns).toBeDefined();
        });

        it("returns catch-all glob pattern", function() {
            expect(amity.patterns.getAllPattern()).toBe("/**/*");
        });

        describe("returns a pattern for lambda functions", function() {
            var lambdaPatternNoTests;
            var lambdaPatternWithTests;
            beforeEach(function() {
                lambdaPatternNoTests = amity.patterns.getLambdaPattern("ciccioPasticcio", true);
                lambdaPatternWithTests = amity.patterns.getLambdaPattern("ciccioPasticcio", false);
            });

            it("containing folder with given name", function() {
                expect(lambdaPatternNoTests).toContain("ciccioPasticcio/**/*");
                expect(lambdaPatternWithTests).toContain("ciccioPasticcio/**/*");
            });
            it("excluding aws folder and files", function() {
                expect(lambdaPatternNoTests).toContain("!ciccioPasticcio/**/node_modules/aws-sdk/**/*");
                expect(lambdaPatternNoTests).toContain("!ciccioPasticcio/**/node_modules/aws-sdk");
                expect(lambdaPatternWithTests).toContain("!ciccioPasticcio/**/node_modules/aws-sdk/**/*");
                expect(lambdaPatternWithTests).toContain("!ciccioPasticcio/**/node_modules/aws-sdk");

            });
            it("excluding minified modules functions", function() {
                expect(lambdaPatternNoTests).toContain("!ciccioPasticcio/**/node_modules/**/*min.js");
                expect(lambdaPatternWithTests).toContain("!ciccioPasticcio/**/node_modules/**/*min.js");
            });
            it("excluding sourcemaps", function() {
                expect(lambdaPatternNoTests).toContain("!ciccioPasticcio/**/node_modules/**/*.map");
                expect(lambdaPatternWithTests).toContain("!ciccioPasticcio/**/node_modules/**/*.map");
            });
            it("excluding npm package", function() {
                expect(lambdaPatternNoTests).toContain("!ciccioPasticcio/**/*package.json");
                expect(lambdaPatternWithTests).toContain("!ciccioPasticcio/**/*package.json");
            });

            describe("and if tests are not excluded", function() {
                it("the pattern contains them", function() {
                    expect(lambdaPatternNoTests).toContain("!ciccioPasticcio/test/**/*");
                    expect(lambdaPatternWithTests).not.toContain("!ciccioPasticcio/test/**/*");
                });

            });


        });

        describe("returns a pattern for tests", function(){
            it("that matches specs",function(){
                var p = amity.patterns.getTestsPattern();
                var pattern = "/**/*[S|s]pec.js";

                expect(p.substr(p.length-pattern.length)).toBe(pattern);
            });
        });
    });


});