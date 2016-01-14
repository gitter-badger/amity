"use strict";

var gulp = require("gulp");
var gutil = require("gulp-util");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var runSequence = require("run-sequence");
var fs = require("fs");
var path = require("path");
var del = require("del");
var jasmineNode = require("gulp-jasmine-node");

var CONST = {
    testPattern: ["tests/**/*[S|s]pec.js"],
    jsPattern: ["src/**/*.js", "!tests/**/*.Spec.js"],
    dataPattern: ["package.json", "README.md", "LICENSE", "node_modules"],
    distFolder: "./dist"
};

gulp.task('test', function() {
    return gulp.src(CONST.testPattern)
        .pipe(jasmineNode({
            timeout: 10000,
            color: true,
            verbose: true
        }));
});


gulp.task("default", ["compile", "copyData"]);

gulp.task("clean", function() {
    del(CONST.distFolder);
});

gulp.task("compile", function() {
    gulp.src(CONST.jsPattern)
        .pipe(uglify())
        .pipe(gulp.dest(CONST.distFolder));
});

gulp.task("copyData", function() {
    gulp.src(CONST.dataPattern)
        .pipe(gulp.dest(CONST.distFolder));
});
