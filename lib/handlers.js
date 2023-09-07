const _data = require("./data");
const helpers = require("./helpers");
const config = require("../config");
const _url = require("url");
const dns = require("dns");

// Define handlers
const handlers = {};

/*
 *
 * HTML handers
 *
 */

// Index handler
handlers.index = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method !== "get") return callback(405, undefined, "html");

    // Prepare data for interpolation
    const templateData = {
        "head.title": "Uptime Monitoring - No Dependencies",
        "head.description":
            "Free simple uptime monitoring for http/https site of all kinds. When your site goes down, you'll be notified via SMS",
        "body.class": "index",
    };

    // Read in a template as a string
    helpers.getTemplate("index", templateData, (err, str) => {
        if (err || !str) return callback(500, undefined, "html");

        // Add universal template header and footer
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
            if (err || !fullString) return callback(500, undefined, "html");
            return callback(200, fullString, "html");
        });
    });
};

// Create account handler
handlers.accountCreate = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method !== "get") return callback(405, undefined, "html");

    // Prepare data for interpolation
    const templateData = {
        "head.title": "Create an account",
        "head.description": "Signup is easy and only takes a few seconds",
        "body.class": "accountCreate",
    };

    // Read in a template as a string
    helpers.getTemplate("accountCreate", templateData, (err, str) => {
        if (err || !str) return callback(500, undefined, "html");

        // Add universal template header and footer
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
            if (err || !fullString) return callback(500, undefined, "html");
            return callback(200, fullString, "html");
        });
    });
};

// Session create handler
handlers.sessionCreate = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method !== "get") return callback(405, undefined, "html");

    // Prepare data for interpolation
    const templateData = {
        "head.title": "Login to your account",
        "head.description": "Enter your phone number and password to access your account",
        "body.class": "sessionCreate",
    };

    // Read in a template as a string
    helpers.getTemplate("sessionCreate", templateData, (err, str) => {
        if (err || !str) return callback(500, undefined, "html");

        // Add universal template header and footer
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
            if (err || !fullString) return callback(500, undefined, "html");
            return callback(200, fullString, "html");
        });
    });
};

// Session deleted handler
handlers.sessionDeleted = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method !== "get") return callback(405, undefined, "html");

    // Prepare data for interpolation
    const templateData = {
        "head.title": "Logged out",
        "head.description": "You have been logged out of your account",
        "body.class": "sessionDeleted",
    };

    // Read in a template as a string
    helpers.getTemplate("sessionDeleted", templateData, (err, str) => {
        if (err || !str) return callback(500, undefined, "html");

        // Add universal template header and footer
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
            if (err || !fullString) return callback(500, undefined, "html");
            return callback(200, fullString, "html");
        });
    });
};

// Acccount edit handler
handlers.accountEdit = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method !== "get") return callback(405, undefined, "html");

    // Prepare data for interpolation
    const templateData = {
        "head.title": "Account Settings",
        "body.class": "accountEdit",
    };

    // Read in a template as a string
    helpers.getTemplate("accountEdit", templateData, (err, str) => {
        if (err || !str) return callback(500, undefined, "html");

        // Add universal template header and footer
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
            if (err || !fullString) return callback(500, undefined, "html");
            return callback(200, fullString, "html");
        });
    });
};

// Acccount deleted handler
handlers.accountDeleted = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method !== "get") return callback(405, undefined, "html");

    // Prepare data for interpolation
    const templateData = {
        "head.title": "Account Deleted",
        "head.description": "Your account has been deleted",
        "body.class": "accountDeleted",
    };

    // Read in a template as a string
    helpers.getTemplate("accountDeleted", templateData, (err, str) => {
        if (err || !str) return callback(500, undefined, "html");

        // Add universal template header and footer
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
            if (err || !fullString) return callback(500, undefined, "html");
            return callback(200, fullString, "html");
        });
    });
};

// create check handler
handlers.checksCreate = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method !== "get") return callback(405, undefined, "html");

    // Prepare data for interpolation
    const templateData = {
        "head.title": "Create a new check",
        "body.class": "checksCreate",
    };

    // Read in a template as a string
    helpers.getTemplate("checksCreate", templateData, (err, str) => {
        if (err || !str) return callback(500, undefined, "html");

        // Add universal template header and footer
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
            if (err || !fullString) return callback(500, undefined, "html");
            return callback(200, fullString, "html");
        });
    });
};

// Checks list handler
handlers.checksList = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method !== "get") return callback(405, undefined, "html");

    // Prepare data for interpolation
    const templateData = {
        "head.title": "Dashboard",
        "body.class": "checksList",
    };

    // Read in a template as a string
    helpers.getTemplate("checksList", templateData, (err, str) => {
        if (err || !str) return callback(500, undefined, "html");

        // Add universal template header and footer
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
            if (err || !fullString) return callback(500, undefined, "html");
            return callback(200, fullString, "html");
        });
    });
};

// Checks edit handler
handlers.checksEdit = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method !== "get") return callback(405, undefined, "html");

    // Prepare data for interpolation
    const templateData = {
        "head.title": "Edit Details",
        "body.class": "checksEdit",
    };

    // Read in a template as a string
    helpers.getTemplate("checksEdit", templateData, (err, str) => {
        if (err || !str) return callback(500, undefined, "html");

        // Add universal template header and footer
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
            if (err || !fullString) return callback(500, undefined, "html");
            return callback(200, fullString, "html");
        });
    });
};

// favicon handler
handlers.favicon = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method !== "get") return callback(405, undefined, "html");

    // Read in favicon data
    helpers.getStaticAsset("favicon.ico", (err, faviconData) => {
        if (err || !faviconData) return callback(500, undefined, "html");
        callback(200, faviconData, "favicon");
    });
};

// Public assets
handlers.public = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method !== "get") return callback(405, undefined, "html");

    // Get the file name being requested
    const trimmedAssetName = data.path.replace("public/", "").trim();
    if (!trimmedAssetName.length) return callback(404, undefined, "html");

    // Read in the asset's data
    helpers.getStaticAsset(trimmedAssetName, (err, assetData) => {
        if (err || !assetData) return callback(404, undefined, "html");

        // Determine content type (default to text)
        let contentType = "plain";

        if (trimmedAssetName.includes(".css")) contentType = "css";
        if (trimmedAssetName.includes(".ico")) contentType = "favicon";
        if (trimmedAssetName.includes(".jpg")) contentType = "jpg";
        if (trimmedAssetName.includes(".png")) contentType = "png";

        callback(200, assetData, contentType);
    });
};

/*
 *
 * JSON API handlers
 *
 */

// Define sample handler
handlers.ping = (data, callback) => {
    // callback a http status code and a payload object
    callback(200);
};

// Users
handlers.users = (data, callback) => {
    const acceptableMethods = ["post", "get", "put", "delete"];
    if (acceptableMethods.includes(data.method)) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for the user sub methods
handlers._users = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = (data, callback) => {
    // Check that all required fields are filled out
    let { firstName, lastName, phone, password, tosAgreement } = data.payload;
    firstName =
        typeof firstName === "string" && firstName.trim().length > 0 ? firstName.trim() : false;
    lastName = typeof lastName === "string" && lastName.trim().length > 0 ? lastName.trim() : false;
    phone = typeof phone === "string" && phone.trim().length == 13 ? phone.trim() : false;
    password = typeof password === "string" && password.trim().length > 0 ? password.trim() : false;
    tosAgreement =
        typeof tosAgreement === "boolean" && tosAgreement === true ? tosAgreement : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure that user doesn't already exist
        _data.read("users", phone, (err, data) => {
            if (err) {
                // Hash the password
                const hashedPassword = helpers.hash(password);
                // Create the user object
                if (hashedPassword) {
                    const userObject = { firstName, lastName, phone, hashedPassword, tosAgreement };

                    // Store the user
                    _data.create("users", phone, userObject, (err) => {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, { error: "Could not create the new user" });
                        }
                    });
                } else {
                    callback(500, { error: "Could not hash the user's password" });
                }
            } else {
                // User already exists
                callback(400, { error: "User with that phone number already exists" });
            }
        });
    } else {
        callback(400, { error: "Missing required fields" });
    }
};

// Users - get
// Required data: phone
// Optional data: none
handlers._users.get = (data, callback) => {
    // Check that the provided phone number is valid
    let phone =
        typeof data.query.phone === "string" && data.query.phone.trim().length === 13
            ? data.query.phone.trim()
            : false;

    if (!phone) return callback(400, { error: "Missing required field" });

    // Get the token from the header
    let { token } = data.headers;
    token = typeof token === "string" && token.length ? token : false;
    if (!token) return callback(401, { error: "Unauthorized" });

    // Verify that the given token is valid for the phone number
    handlers._tokens.verifyToken(token, phone, (isValid) => {
        if (!isValid) return callback(401, { error: "Unauthorized" });
        _data.read("users", phone, (err, data) => {
            if (err || !data) return callback(404, { error: "User does not exist" });
            // Remove the hashed password from the data before returning
            delete data.hashedPassword;
            callback(200, data);
        });
    });
};

// Users - put
// Required data: phone
// Optional data: firstName, lastName, password (at least one must be specified)
handlers._users.put = (data, callback) => {
    let phone =
        typeof data.payload.phone === "string" && data.payload.phone.trim().length === 13
            ? data.payload.phone.trim()
            : false;

    if (!phone) return callback(400, { error: "Missing required field" });

    // Get the token from the header
    let { token } = data.headers;
    token = typeof token === "string" && token.length ? token : false;
    if (!token) return callback(401, { error: "Unauthorized" });

    // Verify that the given token is valid for the phone number
    handlers._tokens.verifyToken(token, phone, (isValid) => {
        if (!isValid) return callback(401, { error: "Unauthorized" });
        let { firstName, lastName, password } = data.payload;
        firstName =
            typeof firstName === "string" && firstName.trim().length > 0 ? firstName.trim() : false;
        lastName =
            typeof lastName === "string" && lastName.trim().length > 0 ? lastName.trim() : false;
        phone = typeof phone === "string" && phone.trim().length == 13 ? phone.trim() : false;
        password =
            typeof password === "string" && password.trim().length > 0 ? password.trim() : false;

        // Error if nothing is sent to update
        if (!firstName && !lastName && !password)
            return callback(400, { error: "Missing fields to update" });

        // Lookup user
        _data.read("users", phone, (err, user) => {
            if (err || !user) return callback(400, { error: "User not found" });
            // Update the fields that are necessary
            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (password) user.hashedPassword = helpers.hash(password);

            // Store the update
            _data.update("users", phone, user, (err) => {
                if (err) return callback(500, { error: "Could not update the user" });
                callback(200);
            });
        });
    });
};

// Users - delete
// Required data: phone
// Optional data: none
// @TODO Cleanup (delete) any other data files associated with this user
handlers._users.delete = (data, callback) => {
    // Check that the provided phone number is valid
    let phone =
        typeof data.query.phone === "string" && data.query.phone.trim().length === 13
            ? data.query.phone.trim()
            : false;

    if (!phone) return callback(400, { error: "Missing required field" });

    // Get the token from the header
    let { token } = data.headers;
    token = typeof token === "string" && token.length ? token : false;
    if (!token) return callback(401, { error: "Unauthorized" });

    // Verify that the given token is valid for the phone number
    handlers._tokens.verifyToken(token, phone, (isValid) => {
        if (!isValid) return callback(401, { error: "Unauthorized" });
        _data.read("users", phone, (err, user) => {
            if (err || !user) return callback(404, { error: "User not found" });

            // Delete the user
            _data.delete("users", phone, (err) => {
                if (err) return callback(500, { error: "Error deleting user" });

                // Delete user checks
                if (!Array.isArray(user.checks) || !user.checks.length) return callback(200);
                let checksDeleted = 0;
                let deletionErrors = false;

                user.checks.forEach((checkId) => {
                    _data.delete("checks", checkId, (err) => {
                        if (err) deletionErrors = true;
                        checksDeleted++;

                        if (checksDeleted === user.checks.length) {
                            if (deletionErrors)
                                return callback(500, {
                                    error: "Error deleting user checks, all checks may not have been deleted",
                                });
                            callback(200);
                        }
                    });
                });
            });
        });
    });
};

handlers.notFound = (data, callback) => {
    callback(404);
};

// Tokens
handlers.tokens = (data, callback) => {
    const acceptableMethods = ["post", "get", "put", "delete"];
    if (acceptableMethods.includes(data.method)) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for all the token methods
handlers._tokens = {};

// Tokens - post
// Required data: phone, password
// Optional data: none
handlers._tokens.post = (data, callback) => {
    let { phone, password } = data.payload;
    phone = typeof phone === "string" && phone.trim().length == 13 ? phone.trim() : false;
    password = typeof password === "string" && password.trim().length > 0 ? password.trim() : false;

    if (!phone || !password) return callback(400, { error: "Missing required fields" });
    // Lookup the user who matches the phone number
    _data.read("users", phone, (err, userData) => {
        if (err || !userData) return callback(400, { error: "Could not find the specified user" });
        // Hash the sent password and compare it to the password stored in the user object
        const hashedPassword = helpers.hash(password);
        if (hashedPassword !== userData.hashedPassword)
            return callback(400, {
                error: "Password did not match the specified user's stored password",
            });
        // If valid, create a new token with a random name. Set expiration date to 1 hour in the future
        const tokenId = helpers.createRandomString(20);

        const expires = Date.now() + 60 * 60 * 1000;
        const tokenObject = { phone: phone, id: tokenId, expires };

        // Store the token
        _data.create("tokens", tokenId, tokenObject, (err) => {
            if (err) return callback(500, { error: "Could not store token" });
            callback(200, tokenObject);
        });
    });
};

// Tokens - get
// Required data: id
// Optional data: none
handlers._tokens.get = (data, callback) => {
    // Check that the provided id is valid
    let id =
        typeof data.query.id === "string" && data.query.id.trim().length === 20
            ? data.query.id.trim()
            : false;

    if (!id) return callback(400, { error: "Missing required field" });

    _data.read("tokens", id, (err, tokenData) => {
        if (err || !tokenData) return callback(404, { error: "Token does not exist" });
        callback(200, tokenData);
    });
};

// Tokens - put
// Required data: id, extend
// Optional data: none
handlers._tokens.put = (data, callback) => {
    let { id, extend } = data.payload;
    id = typeof id === "string" && id.trim().length == 20 ? id.trim() : false;
    extend = typeof extend === "boolean" && extend === true ? extend : false;

    if (!id || !extend)
        return callback(400, { error: "Missing required fields or fields are invalid" });
    // Lookup the token
    _data.read("tokens", id, (err, tokenData) => {
        if (err || !tokenData) return callback(400, { error: "Token does not exist" });
        // Check to make sure the token isn't already expired
        if (Date.now() > tokenData.expires)
            return callback(400, { error: "Token has already expired and cannot be extended" });
        tokenData.expires = Date.now() + 60 * 60 * 1000;

        // Store the new updates
        _data.update("tokens", id, tokenData, (err) => {
            if (err) return callback(500, { error: "Could not update token" });
            callback(200);
        });
    });
};

// Tokens - delete
handlers._tokens.delete = (data, callback) => {
    // Check that the provided id is valid
    let id =
        typeof data.query.id === "string" && data.query.id.trim().length === 20
            ? data.query.id.trim()
            : false;

    if (!id) return callback(400, { error: "Missing required field" });

    _data.read("tokens", id, (err, tokenData) => {
        if (err || !tokenData) return callback(404, { error: "Token not found" });

        // Delete the token
        _data.delete("tokens", id, (err) => {
            if (err) return callback(500, { error: "Error deleting token" });
            callback(200);
        });
    });
};

// Verify if a given tokenId is valid for a given user
handlers._tokens.verifyToken = (id, phone, callback) => {
    // Lookup the token
    _data.read("tokens", id, (err, tokenData) => {
        if (err || !tokenData) return callback(false);
        // Check that the token is for the given user and has not expired
        if (tokenData.phone !== phone || tokenData.expires < Date.now()) return callback(false);
        callback(true);
    });
};

// Checks
handlers.checks = (data, callback) => {
    const acceptableMethods = ["post", "get", "put", "delete"];
    if (acceptableMethods.includes(data.method)) {
        handlers._checks[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._checks = {};

// Checks - post
// Required data: protocol, url, method, successCodes, timeoutSeconds
// Optional data: none
handlers._checks.post = (data, callback) => {
    // Validate inputs
    let { protocol, url, method, successCodes, timeoutSeconds } = data.payload;
    protocol =
        typeof protocol === "string" && ["https", "http"].includes(protocol) ? protocol : false;
    url = typeof url === "string" && url.length > 0 ? url.trim() : false;
    method =
        typeof method === "string" && ["post", "get", "put", "delete"].includes(method)
            ? method
            : false;
    successCodes =
        typeof successCodes === "object" && successCodes instanceof Array && successCodes.length > 0
            ? successCodes
            : false;
    timeoutSeconds =
        typeof (timeoutSeconds === "number") &&
        timeoutSeconds % 1 === 0 &&
        timeoutSeconds >= 1 &&
        timeoutSeconds <= 5
            ? timeoutSeconds
            : false;

    if (!protocol || !url || !method || !successCodes || !timeoutSeconds)
        return callback(400, { error: "Missing required fields" });

    // Get the token from the header
    let { token } = data.headers;
    token = typeof token === "string" && token.length ? token : false;
    if (!token) return callback(401, { error: "Unauthorized" });

    // Lookup the user by reading the token
    _data.read("tokens", token, (err, tokenData) => {
        if (err || !tokenData) return callback(403);
        let userPhone = tokenData.phone;

        // Lookup the user data
        _data.read("users", userPhone, (err, userData) => {
            console.log(err || !userData);
            if (err || !userData) return callback(403);
            let userChecks =
                typeof userData.checks === "object" && userData.checks instanceof Array
                    ? userData.checks
                    : [];
            // Verify that the user has less than the number of max checks per user;
            if (userChecks.length >= config.maxChecks)
                return callback(400, {
                    error: `The user already has the maximum number of checks (${config.maxChecks})`,
                });

            // Verify that the URL given has DNS entires (and therefore can resolve)
            const parsedUrl = _url.parse(protocol + "://" + url, true);
            const hostName =
                typeof parsedUrl.hostname === "string" && parsedUrl.hostname.length > 0
                    ? parsedUrl.hostname
                    : false;
            dns.resolve(hostName, (err, records) => {
                if (err || !records)
                    return callback(400, {
                        Error: "Host name of the url entered did not resolve to any DNS entries",
                    });

                // Create a random id for the check
                const checkId = helpers.createRandomString(20);

                // Create the check object, and include the user's phone
                const checkObject = {
                    id: checkId,
                    userPhone,
                    protocol,
                    method,
                    url,
                    timeoutSeconds,
                    successCodes,
                };
                _data.create("checks", checkId, checkObject, (err) => {
                    if (err) return callback(500, { Error: "Error persisting check" });

                    // Add the check id to the user's object
                    userData.checks = userChecks;
                    userData.checks.push(checkId);

                    // Save the new user data
                    _data.update("users", userPhone, userData, (err) => {
                        if (err) return callback(500, { Error: "Error updating user with check" });
                        // Return the data about the new check to the requester
                        callback(200, checkObject);
                    });
                });
            });
        });
    });
};

// Checks - get
// Required data: id
// Optional data: none
handlers._checks.get = (data, callback) => {
    // Check that the provided id is valid
    let id =
        typeof data.query.id === "string" && data.query.id.trim().length === 20
            ? data.query.id.trim()
            : false;

    if (!id) return callback(400, { error: "Missing required field" });
    let { token } = data.headers;
    token = typeof token === "string" && token.length ? token : false;
    if (!token) return callback(401, { error: "Unauthorized" });

    // Lookup the check
    _data.read("checks", id, (err, checkData) => {
        if (err || !checkData) return callback(404, { Error: "Check not found" });

        // Verify that the given token is valid and belongs to the user who created the check
        handlers._tokens.verifyToken(token, checkData.userPhone, (isValid) => {
            if (!isValid) return callback(403, { error: "Unauthorized" });
            callback(200, checkData);
        });
    });
};

// Checks - put
// Required data: id
// Optional data: protocol, method, url, successCodes, timeoutSeconds (at least one must be provided)
handlers._checks.put = (data, callback) => {
    let { id, protocol, url, method, successCodes, timeoutSeconds } = data.payload;
    id = typeof id === "string" && id.trim().length == 20 ? id.trim() : false;
    protocol =
        typeof protocol === "string" && ["https", "http"].includes(protocol) ? protocol : false;
    url = typeof url === "string" && url.length > 0 ? url.trim() : false;
    method =
        typeof method === "string" && ["post", "get", "put", "delete"].includes(method)
            ? method
            : false;
    successCodes =
        typeof successCodes === "object" && successCodes instanceof Array && successCodes.length > 0
            ? successCodes
            : false;
    timeoutSeconds =
        typeof (timeoutSeconds === "number") &&
        timeoutSeconds % 1 === 0 &&
        timeoutSeconds >= 1 &&
        timeoutSeconds <= 5
            ? timeoutSeconds
            : false;

    if (!id || (!protocol && !url && !method && !successCodes && !timeoutSeconds))
        return callback(400, { error: "Missing required fields" });

    let { token } = data.headers;
    token = typeof token === "string" && token.length ? token : false;
    if (!token) return callback(401, { error: "Unauthorized" });

    // Lookup the check
    _data.read("checks", id, (err, checkData) => {
        if (err || !checkData) return callback(404, { Error: "Check not found" });

        // Verify that the given token is valid and belongs to the user who created the check
        handlers._tokens.verifyToken(token, checkData.userPhone, (isValid) => {
            console.log(token, checkData.userPhone, isValid);
            if (!isValid) return callback(403, { error: "Unauthorized" });

            // Update the check data with the provided fields
            if (protocol) checkData.protocol = protocol;
            if (url) checkData.url = url;
            if (method) checkData.method = method;
            if (successCodes) checkData.successCodes = successCodes;
            if (timeoutSeconds) checkData.timeoutSeconds = timeoutSeconds;

            _data.update("checks", id, checkData, (err) => {
                if (err) return callback(500, { error: "Error updating the check" });
                callback(200);
            });
        });
    });
};

// Checks - delete
// Required data: id
// Optional data: none
handlers._checks.delete = (data, callback) => {
    // Check that the provided id is valid
    let id =
        typeof data.query.id === "string" && data.query.id.trim().length === 20
            ? data.query.id.trim()
            : false;

    if (!id) return callback(400, { error: "Missing required field" });
    let { token } = data.headers;
    token = typeof token === "string" && token.length ? token : false;
    if (!token) return callback(401, { error: "Unauthorized" });

    // Lookup the check
    _data.read("checks", id, (err, checkData) => {
        if (err || !checkData) return callback(404, { Error: "Check not found" });

        // Verify that the given token is valid and belongs to the user who created the check
        handlers._tokens.verifyToken(token, checkData.userPhone, (isValid) => {
            if (!isValid) return callback(403, { error: "Unauthorized" });

            // Lookup the user
            _data.read("users", checkData.userPhone, (err, userData) => {
                if (err || !userData)
                    return callback(404, { error: "User who created check not found" });
                const checks = Array.isArray(userData.checks) ? userData.checks : [];
                userData.checks = checks.filter((check) => check !== id);

                // Update user with new checks
                _data.update("users", checkData.userPhone, userData, (err) => {
                    if (err) return callback(500, { error: "error updating user checks" });

                    // Delete the check
                    _data.delete("checks", id, (err) => {
                        if (err) return callback(500, { error: "error deleting check" });
                        callback(200);
                    });
                });
            });
        });
    });
};

// Error handler
handlers.exampleError = (data, callback) => {
    throw new Error("Sorry");
};

module.exports = handlers;
