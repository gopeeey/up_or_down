// Helpers for various tasks

// Dependencies
const crypto = require("crypto");
const config = require("../config");
const https = require("https");
const queryString = require("querystring");
const path = require("path");
const fs = require("fs");

// Container for all the helpers
const helpers = {};

// Create a SHA256 hash
helpers.hash = (string) => {
    if (typeof string !== "string" || !string.length) return false;
    const hash = crypto.createHmac("sha256", config.hashingSecret).update(string).digest("hex");
    return hash;
};

// Parse json string to object without throwing an error
helpers.parseJsonToObject = (json) => {
    try {
        const obj = JSON.parse(json);
        return obj;
    } catch (err) {
        console.log(err);
        return {};
    }
};

// Create a string of random alphanumeric characters of a given length
helpers.createRandomString = (strLength) => {
    strLength = typeof strLength === "number" && strLength > 0 ? strLength : false;
    if (!strLength) return false;
    // Define all possible characters that could go into a gring
    const possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

    // Start the final string
    let str = "";
    while (strLength > 0) {
        // Get random character from the possibleCharacters string
        let randomCharacter = possibleCharacters.charAt(
            Math.floor(Math.random() * possibleCharacters.length)
        );
        // Append this character to the final string
        str += randomCharacter;
        strLength--;
    }

    return str;
};

// Send and SMS message via Twilio
helpers.sendTwilioSms = (phone, msg, callback) => {
    // Validate parameters
    phone = typeof phone === "string" && phone.trim().length == 13 ? phone.trim() : false;
    msg =
        typeof msg === "string" && msg.trim().length > 0 && msg.trim().length <= 1600
            ? msg.trim()
            : false;

    if (!phone || !msg) return callback("Given paramters were missing or invalid");

    // Configure the request payload
    const payload = { From: config.twilio.fromPhone, To: "+" + phone, Body: msg };

    // Stringify the payload
    const stringPayload = queryString.stringify(payload);

    // Configure the request details
    const requestDetails = {
        protocol: "https:",
        hostname: "api.twilio.com",
        method: "POST",
        path: "/2010-04-01/Accounts/" + config.twilio.accountSid + "/Messages.json",
        auth: config.twilio.accountSid + ":" + config.twilio.authToken,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(stringPayload),
        },
    };

    // Instantiate the request object
    const req = https.request(requestDetails, (res) => {
        // Grab the status of the sent request
        const status = res.statusCode;
        // Callback successfully if the request went through
        if (![200, 201].includes(status)) return callback(`Status code returned was ${status}`);
        callback(false);
    });

    // Bind to the error event so it doesn't get thrown
    req.on("error", (err) => {
        callback(err);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request;
    req.end();
};

// Get the string content of a template
helpers.getTemplate = (templateName, data, callback) => {
    templateName =
        typeof templateName === "string" && templateName.length > 0 ? templateName : false;
    data = typeof data === "object" && data !== null ? data : {};

    if (!templateName) return callback("Invalid template name");

    const templateDir = path.join(__dirname, "/../templates/");
    fs.readFile(templateDir + templateName + ".html", "utf-8", (err, str) => {
        if (err || !str || !str.length) return callback("No template could be found");
        // Do interpolation on string
        const finalString = helpers.interpolate(str, data);
        callback(false, finalString);
    });
};

// Add the universal header and footer to a string, and pass provided data object to the header and footer for interpolation
helpers.addUniversalTemplates = (str, data, callback) => {
    str = typeof str === "string" && str.length ? str : "";
    data = typeof data === "object" && data !== null ? data : {};

    // Get the header
    helpers.getTemplate("_header", data, (err, headerStr) => {
        if (err || !headerStr) return callback("Could not find the header template");

        // Get the footer
        helpers.getTemplate("_footer", data, (err, footerStr) => {
            if (err || !footerStr) return callback("Could not find footer template");

            // Add them all together
            const fullString = headerStr + str + footerStr;
            callback(false, fullString);
        });
    });
};

// Take a given string and find/replace all the keys within it
helpers.interpolate = (str, data) => {
    str = typeof str === "string" && str.length ? str : "";
    data = typeof data === "object" && data !== null ? data : {};

    // Add the templateGlobals to the data object, prepending their key name with "global"
    for (const keyName in config.templateGlobals) {
        if (config.templateGlobals.hasOwnProperty(keyName)) {
            data["global." + keyName] = config.templateGlobals[keyName];
        }
    }

    // For each key in the global object, insert it's value into the string at the corresponding placeholder
    for (const key in data) {
        if (data.hasOwnProperty(key) && typeof data[key] === "string") {
            const replace = data[key];
            const find = new RegExp("{" + key + "}", "g");
            str = str.replace(find, replace);
        }
    }

    return str;
};

// Get the content of a public asset
helpers.getStaticAsset = (filename, callback) => {
    filename = typeof filename === "string" && filename.length > 0 ? filename : false;
    if (!filename) return callback("A valid filename was not specified");

    const publicDir = path.join(__dirname, "/../public/");

    // read file
    fs.readFile(publicDir + filename, (err, data) => {
        if (err || !data) return callback("No file could be found");
        callback(false, data);
    });
};

// Sample function for test runner
helpers.getANumber = () => 1;

module.exports = helpers;
