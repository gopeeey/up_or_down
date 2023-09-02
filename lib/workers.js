// These are worker related tasks
// Dependencies
const path = require("path");
const fs = require("fs");
const _data = require("./data");
const https = require("https");
const http = require("http");
const helpers = require("./helpers");
const url = require("url");
const _logs = require("./logs");
const util = require("util");

const debug = util.debuglog("workers");

const workers = {};

workers.log = (originalCheckData, outcome, state, alertNeeded, timeOfCheck) => {
    // Form the log data
    const logData = {
        check: originalCheckData,
        outcome,
        state,
        alert: alertNeeded,
        time: timeOfCheck,
    };

    // Convert data to a string
    const logString = JSON.stringify(logData);

    // Determine the name of the log file (different logs for different checks at different times)
    const logFileName = originalCheckData.id;

    // Append the log string to the file
    _logs.append(logFileName, logString, (err) => {
        if (err) return debug("Logging to file failed");
        debug("Logging to file succeeded");
    });
};

// Alerts the user to a change in their check status
workers.alertUserToStatusChange = (checkData) => {
    const message = `Alert! Your check for ${checkData.method.toUpperCase()} ${
        checkData.protocol
    }://${checkData.url} is currently ${checkData.state}`;

    helpers.sendTwilioSms(checkData.userPhone, message, (err) => {
        if (err)
            return debug("Could not send sms to user who has had a status change in their check");
        debug("User was alerted to a status change in their check via SMS", message);
    });
};

// Processes the check outcome and updates the check data as needed, and triggers an alarm to the user if needed
// Has special logic for accomodating a check that has never been tested before (shouldn't alert user on that one)
workers.processCheckOutcome = (originalCheckData, outcome) => {
    // Decide of the check is considered up or down
    const state =
        !outcome.err &&
        outcome.responseCode &&
        originalCheckData.successCodes.includes(outcome.responseCode)
            ? "up"
            : "down";

    // Decide if an alert is needed
    const alertNeeded = originalCheckData.lastChecked && originalCheckData.state !== state;

    const timeOfCheck = Date.now();
    // Update check data
    const newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = timeOfCheck;

    workers.log(originalCheckData, outcome, state, alertNeeded, timeOfCheck);

    // Save the updates
    _data.update("checks", newCheckData.id, newCheckData, (err) => {
        if (err) return debug("Error trying to save updates to one of the check", newCheckData);

        // Send the new check data to the next phase in the process if needed
        if (alertNeeded) return workers.alertUserToStatusChange(newCheckData);
        debug("Check outcome has not changed, no alert needed");
    });
};

// Perform the check, send the original check data and the outcome of the check process to the next step in the process
workers.performCheck = (originalCheckData) => {
    // Prepare the initial check outcome
    const outcome = { err: false, responseCode: false };

    // Mark that the outcome has not been sent yet
    let outcomeSent = false;

    const parsedUrl = url.parse(originalCheckData.protocol + "://" + originalCheckData.url, true);
    const { hostname, path } = parsedUrl; // Using path and not pathname because we want the query string (if present)

    const requestDetails = {
        protocol: originalCheckData.protocol + ":",
        hostname,
        method: originalCheckData.method.toUpperCase(),
        path,
        timeout: originalCheckData.timeoutSeconds * 1000,
    };

    // Instantiate request object
    const _moduleToUse = originalCheckData.protocol === "http" ? http : https;
    const req = _moduleToUse.request(requestDetails, (res) => {
        // Update the check outcome and pass the data along
        outcome.responseCode = res.statusCode;

        if (!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, outcome);
            outcomeSent = true;
        }
    });

    req.on("error", (err) => {
        // Update the check outcome and pass the data along
        outcome.err = { err: true, value: err };
        if (!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, outcome);
            outcomeSent = true;
        }
    });

    // Bind to the timeout
    req.on("timeout", (err) => {
        // Update the check outcome and pass the data along
        outcome.err = { err: true, value: "timeout" };
        if (!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, outcome);
            outcomeSent = true;
        }
    });

    // End the request
    req.end();
};

// Sanity checking the check data
workers.validateCheckData = (originalCheckData) => {
    originalCheckData =
        typeof originalCheckData === "object" && originalCheckData != null ? originalCheckData : {};
    originalCheckData.id =
        typeof originalCheckData.id === "string" && originalCheckData.id.length === 20
            ? originalCheckData.id
            : false;
    originalCheckData.userPhone =
        typeof originalCheckData.userPhone === "string" && originalCheckData.userPhone.length === 13
            ? originalCheckData.userPhone
            : false;
    originalCheckData.protocol =
        typeof originalCheckData.protocol === "string" &&
        ["https", "http"].includes(originalCheckData.protocol)
            ? originalCheckData.protocol
            : false;
    originalCheckData.url =
        typeof originalCheckData.url === "string" && originalCheckData.url.length > 0
            ? originalCheckData.url
            : false;

    originalCheckData.method =
        typeof originalCheckData.method === "string" &&
        ["post", "put", "get", "delete"].includes(originalCheckData.method)
            ? originalCheckData.method
            : false;
    originalCheckData.successCodes =
        Array.isArray(originalCheckData.successCodes) && originalCheckData.successCodes.length > 0
            ? originalCheckData.successCodes
            : false;
    originalCheckData.timeoutSeconds =
        typeof originalCheckData.timeoutSeconds === "number" &&
        originalCheckData.timeoutSeconds % 1 === 0 &&
        originalCheckData.timeoutSeconds <= 5
            ? originalCheckData.timeoutSeconds
            : false;

    // Set the keys that may not be set if the workers have never seen this check before
    originalCheckData.state =
        typeof originalCheckData.state === "string" &&
        ["up", "down"].includes(originalCheckData.state)
            ? originalCheckData.state
            : "down";

    originalCheckData.lastChecked =
        typeof originalCheckData.lastChecked === "number" && originalCheckData.lastChecked > 0
            ? originalCheckData.lastChecked
            : false;

    // If all the checks pass, pass the data along to the next function in the process
    if (
        !originalCheckData.id ||
        !originalCheckData.userPhone ||
        !originalCheckData.protocol ||
        !originalCheckData.url ||
        !originalCheckData.method ||
        !originalCheckData.successCodes ||
        !originalCheckData.timeoutSeconds
    )
        return debug("Error one of the checks is not properly formatted", originalCheckData);
    workers.performCheck(originalCheckData);
};

// Lookup all checks, get their data, send to validator
workers.gatherAllChecks = () => {
    // Get all the checks that exist in the system
    _data.list("checks", (err, checks) => {
        if (err || !checks || !checks.length)
            return debug("Error: could not find any checks to process");
        for (const check of checks) {
            // Read in the check data
            _data.read("checks", check, (err, originalCheckData) => {
                if (err || !originalCheckData)
                    return debug("Error reading one of the check data", err);
                // Pass it to the check validator and let that function continue or log errors as needed
                workers.validateCheckData(originalCheckData);
            });
        }
    });
};

// Timer to execute the worker process once per minute
workers.loop = () => {
    setInterval(() => {
        workers.gatherAllChecks();
    }, 60 * 1000);
};

// Rotate (compress) the log files
workers.rotateLogs = () => {
    // List all the (non compressed) log files
    _logs.list(false, (err, logs) => {
        if (err || !logs || !logs.length) return debug("Error: could not find any logs to rotate");
        logs.forEach((logName) => {
            // Compress the data to  a different file
            const logId = logName.replace(".log", "");
            const newFileId = logId + "-" + Date.now();
            _logs.compress(logId, newFileId, (err) => {
                if (err) return debug("Error compressing one of the log files", err);

                // Truncate the log
                _logs.truncate(logId, (err) => {
                    if (err) return debug("Error truncating log file", err);
                    debug("Success truncating log file");
                });
            });
        });
    });
};

// Timer to execute the log rotation process once per day
workers.logRotationLoop = () => {
    setInterval(() => {
        workers.gatherrotateLogsAllChecks();
    }, 24 * 60 * 60 * 1000);
};

workers.init = () => {
    // Send to console, in yellow
    console.log("\x1b[33m%s\x1b[0m", "Background workers are running");

    // Execute all the checks immediately
    workers.gatherAllChecks();

    // Call a loop so the checks continue to execute later on
    workers.loop();

    // Compress all the logs immediately
    workers.rotateLogs();

    // Call the compression loop so logs will be compressed later on
    workers.logRotationLoop();
};

module.exports = workers;
