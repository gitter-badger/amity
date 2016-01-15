"use strict";

var Folders = function() {
    this.code = "code";
    this.cloud = "cloud";
    this.lambda = this.code + "/lambda";
    this.webapp = this.code + "/web";
    this.test = "test";
    this.dist = "dist";

    this.readyToPackage = this.dist + "/dev";
    this.readyToUpload = this.dist + "/prod";

    this.getLambdaFunctions = function(dir) {
        return fs.readdirSync(dir)
            .filter(function(file) {
                return fs.statSync(path.join(dir, file)).isDirectory();
            });
    };

    this.setupProjectFolders = function(baseDir) {
        if (baseDir === undefined) baseDir = "./";
        var directories = [
            path.join(baseDir, this.code),
            path.join(baseDir, this.cloud),
            path.join(baseDir, this.lambda),
            path.join(baseDir, this.webapp),
            path.join(baseDir, this.test),
            path.join(baseDir, this.dist)
        ];

        directories.forEach(function(element) {
            try {
                fs.mkdirSync(element);
            } catch (e) {
                if (e.code != 'EEXIST') throw e;
            }
        });
    };

};

module.exports = Folders;