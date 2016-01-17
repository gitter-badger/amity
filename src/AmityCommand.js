"use strict";

var Amity = require("./amity");

var AmityCommand = function(argv) {
    this.command = argv._[0];

    this.run = function() {
        console.log(JSON.stringify(argv));
        return new Amity(".")[this.command]();

    };
};

module.exports = AmityCommand;