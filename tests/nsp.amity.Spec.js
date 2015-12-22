"use strict";
var version = "0.0.1";

describe("Amity", function() {
    var Amity;

    beforeEach(function() {
        Amity = require("../amity.js");
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

});