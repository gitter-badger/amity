"use strict";

var gulp = require("gulp");
var gutil = require("gulp-util");
var jasmineNode = require("gulp-jasmine-node");

gulp.task('test', function() {
    return gulp.src(["tests/**/*[S|s]pec.js"])
        .pipe(jasmineNode({
            timeout: 10000,
            color: true,
            verbose: true
        }));
});


gulp.task("default", function() {

});
