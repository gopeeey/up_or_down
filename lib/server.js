// Server related tasks

// Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("../config");
const fs = require("fs");
const handlers = require("./handlers");
const helpers = require("./helpers");
const path = require("path");
const util = require("util");

const debug = util.debuglog("server");

// Instantiate the server module object
const server = {};

// All the server logic for both the https and https server
server.unifiedServer = (req, res) => {
    // Get the url and parse it
    const parsedUrl = url.parse(req.url, true);
    // Get the path from the url
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, "");

    // Get HTTP method
    const method = req.method.toLowerCase();

    // Get query string as an object
    const queryStringObject = parsedUrl.query;

    // Get request headers as an object
    const headers = req.headers;

    // Get the payload if any
    const decoder = new StringDecoder("utf-8");
    let buffer = "";
    req.on("data", (chunk) => {
        buffer += decoder.write(chunk);
    });
    req.on("end", () => {
        buffer += decoder.end();

        // choose the handler this request should go to
        // if one is not found use the notFound handler

        let chosenHandler =
            typeof server.router[trimmedPath] !== "undefined"
                ? server.router[trimmedPath]
                : handlers.notFound;

        // If the request is within the public directory, use the public handler instead
        if (trimmedPath.includes("public/")) chosenHandler = handlers.public;
        const handlerData = {
            path: trimmedPath,
            headers,
            payload: buffer ? helpers.parseJsonToObject(buffer) : {},
            query: queryStringObject,
            method,
        };

        try {
            chosenHandler(handlerData, (statusCode, payload, contentType = "json") => {
                server.processHandlerResponse(
                    res,
                    method,
                    trimmedPath,
                    statusCode,
                    payload,
                    contentType
                );
            });
        } catch (err) {
            debug(err);
            server.processHandlerResponse(
                res,
                method,
                trimmedPath,
                500,
                { Error: "An unexpected error has occurred" },
                "json"
            );
        }
    });
};

server.processHandlerResponse = (res, method, trimmedPath, statusCode, payload, contentType) => {
    // Use the status code defined by the chosen handler or default to 200
    statusCode = typeof statusCode === "number" ? statusCode : 200;

    // Use the payload called back by the handler or default to an empty object

    // Return the response parts that are content specific
    let payloadString = "";

    switch (contentType) {
        case "json":
            payload = typeof payload === "object" ? payload : {};
            res.setHeader("Content-Type", "application/json");
            payloadString = JSON.stringify(payload);
            break;
        case "html":
            res.setHeader("Content-Type", "text/html");
            payloadString = typeof payload === "string" ? payload : "";
            break;
        case "favicon":
            res.setHeader("Content-Type", "image/x-icon");
            payloadString = typeof payload !== undefined ? payload : "";
            break;
        case "png":
            res.setHeader("Content-Type", "image/png");
            payloadString = typeof payload !== undefined ? payload : "";
            break;
        case "jpg":
            res.setHeader("Content-Type", "image/jpeg");
            payloadString = typeof payload !== undefined ? payload : "";
            break;
        case "css":
            res.setHeader("Content-Type", "text/css");
            payloadString = typeof payload !== undefined ? payload : "";
            break;
        case "plain":
            res.setHeader("Content-Type", "text/plain");
            payloadString = typeof payload !== undefined ? payload : "";
            break;
        default:
            throw new Error("Invalid content type returned");
    }

    // Return the response parts that are common to all content-types
    res.writeHead(statusCode);
    res.end(payloadString);

    // Log response
    // If response is 200, print green, otherwise, print red
    if (statusCode === 200) {
        debug("\x1b[32m%s\x1b[0m", method.toUpperCase() + " /" + trimmedPath + " " + statusCode);
    } else {
        debug("\x1b[31m%s\x1b[0m", method.toUpperCase() + " /" + trimmedPath + " " + statusCode);
    }
    // debug("\nResponse", statusCode, payloadString);
};

// Instantiating http server
server.httpServer = http.createServer((req, res) => {
    server.unifiedServer(req, res);
});

// Instantiate https server
server.httpsServerOptions = {
    key: fs.readFileSync(path.join(__dirname, "../https/key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "../https/cert.pem")),
};
server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
    server.unifiedServer(req, res);
});

// Define router
server.router = {
    "": handlers.index,
    "account/create": handlers.accountCreate,
    "account/edit": handlers.accountEdit,
    "account/deleted": handlers.accountDeleted,
    "session/create": handlers.sessionCreate,
    "session/deleted": handlers.sessionDeleted,
    "checks/all": handlers.checksList,
    "checks/create": handlers.checksCreate,
    "checks/edit": handlers.checksEdit,
    ping: handlers.ping,
    "api/users": handlers.users,
    "api/tokens": handlers.tokens,
    "api/checks": handlers.checks,
    "favicon.ico": handlers.favicon,
    public: handlers.public,
    "examples/error": handlers.exampleError,
};

server.init = () => {
    // Start the server, and have it listen on port
    server.httpServer.listen(config.httpPort, () =>
        console.log("\x1b[36m%s\x1b[0m", `Listening on port ${config.httpPort}`)
    );

    server.httpsServer.listen(config.httpsPort, () =>
        console.log("\x1b[35m%s\x1b[0m", `Listening on port ${config.httpsPort}`)
    );
};

module.exports = server;
