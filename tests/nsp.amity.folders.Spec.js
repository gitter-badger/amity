"use strict";

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


    });


});