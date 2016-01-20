var action = require("./index.js");

var context = {};
context.succeed = function(data) {
    console.log(JSON.stringify(data));
};

context.fail = function(error) {
    console.log("ERROR:\n" + JSON.stringify(error));
};

var event = require("./test-event.json");

action.handler(event,context);