// Library for storing and rotating logs

// Dependencies
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// Container for the module
const lib = {};

// Base directory of the logs folder
lib.baseDir = path.join(__dirname, "../.logs/");

// Append a string to a file, create the file if it does not exist
lib.append = (fileName, str, callback) => {
    // Open the file for appending
    fs.open(lib.baseDir + fileName + ".log", "a", (err, fileDescriptor) => {
        if (err || !fileDescriptor) return callback("Could not open file for appending");

        // Append to the file and close it
        fs.appendFile(fileDescriptor, str + "\n", (err) => {
            if (err) return callback("Error appending to file");

            fs.close(fileDescriptor, (err) => {
                if (err) return callback("Error closing the file");
                callback(false);
            });
        });
    });
};

// List all the logs and optionally include compressed logs
lib.list = (includeCompressedLogs, callback) => {
    fs.readdir(lib.baseDir, (err, data) => {
        if (err || !data || !data.length) return callback(err, data);

        const trimmedFileNames = [];
        data.forEach((fileName) => {
            // Add the .log files
            if (fileName.includes(".log")) trimmedFileNames.push(fileName.replace(".log", ""));

            // Add on the .gz files
            if (fileName.includes(".gz.b64") && includeCompressedLogs)
                trimmedFileNames.push(fileName.replace(".gz.b64", ""));
        });

        callback(false, trimmedFileNames);
    });
};

// Compress the contents of one .log file into a .gz.b64 file into the same directory
lib.compress = (logId, newFileId, callback) => {
    const sourceFile = logId + ".log";
    const destinationFile = newFileId + ".gz.b64";

    // Read the source file
    fs.readFile(lib.baseDir + sourceFile, "utf-8", (err, inputString) => {
        if (err || !inputString) return callback(err);

        // Compress the data using gzip
        zlib.gzip(inputString, (err, buffer) => {
            if (err || !buffer) return callback(err);

            // Send the data to the destination file
            fs.open(lib.baseDir + destinationFile, "wx", (err, fileDescriptor) => {
                if (err || !fileDescriptor) return callback(err);

                // Write to the destination file
                fs.writeFile(fileDescriptor, buffer.toString("base64"), (err) => {
                    if (err) return callback(err);
                    // Close the destination file
                    fs.close(fileDescriptor, (err) => {
                        if (err) return callback(err);
                        callback(false);
                    });
                });
            });
        });
    });
};

// Decompress the contents of a .gz.b64 file into a string variable
lib.decompress = (fileId, callback) => {
    const fileName = fileId + ".gz.b64";
    fs.readFile(lib.baseDir + fileName, "utf-8", (err, str) => {
        if (err || !str) return callback(err);

        // Decompress data
        const inputBuffer = Buffer.from(str, "base64");
        zlib.unzip(inputBuffer, (err, outputBuffer) => {
            if (err || !outputBuffer) return callback(err);

            // Callback
            const outputString = outputBuffer.toString();
            callback(null, outputString);
        });
    });
};

// Truncate a log file
lib.truncate = (logId, callback) => {
    fs.truncate(lib.baseDir + logId + ".log", 0, (err) => {
        if (err) return callback(err);
        callback(false);
    });
};

// Export the module
module.exports = lib;
