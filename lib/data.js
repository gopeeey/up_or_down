// Library for storing and editing data

// Dependencies
const fs = require("fs");
const path = require("path");
const helpers = require("./helpers");

// Container for the module to be exported
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, "/../.data/");

lib.create = (dir, filename, data, callback) => {
    // Open the file for writing
    fs.open(lib.baseDir + dir + "/" + filename + ".json", "wx", (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // Convert data to string
            const stringData = JSON.stringify(data);

            // Write to file and close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            callback(false);
                        } else {
                            callback("Error closing new file");
                        }
                    });
                } else {
                    callback("Error writing to new file");
                }
            });
        } else {
            callback("Could not create new file, it may already exist");
        }
    });
};

// Read data from a file
lib.read = (dir, filename, callback) => {
    fs.readFile(lib.baseDir + dir + "/" + filename + ".json", "utf-8", (err, data) => {
        if (err) return callback(err);
        callback(null, helpers.parseJsonToObject(data));
    });
};

// Update data inside a file
lib.update = (dir, filename, data, callback) => {
    // Open the file for writing
    fs.open(lib.baseDir + dir + "/" + filename + ".json", "r+", (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // Convert data to string
            const stringData = JSON.stringify(data);

            // Truncatte the file
            fs.ftruncate(fileDescriptor, (err) => {
                if (!err) {
                    // Write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if (!err) {
                            fs.close(fileDescriptor, (err) => {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback("Error closing the file");
                                }
                            });
                        } else {
                            callback("Error writing to existing file");
                        }
                    });
                } else {
                    callback("Error truncating file");
                }
            });
        } else {
            callback("Could not open the file for updating, it may not exist yet");
        }
    });
};

// Delete a file
lib.delete = (dir, filename, callback) => {
    // Unlink the file
    fs.unlink(lib.baseDir + dir + "/" + filename + ".json", (err) => {
        if (!err) {
            callback(false);
        } else {
            callback("Error unlinking file");
        }
    });
};

// list all the items in a directory
lib.list = (dir, callback) => {
    fs.readdir(lib.baseDir + dir + "/", (err, data) => {
        if (err || !data || !data.length) return callback(err, data);
        const trimmedFileNames = [];

        for (const dat of data) {
            trimmedFileNames.push(dat.replace(".json", ""));
        }

        callback(null, trimmedFileNames);
    });
};

module.exports = lib;
