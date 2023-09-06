// Dependencies
const server = require("./lib/server");
const workers = require("./lib/workers");
const cli = require("./lib/cli");

const app = {};

app.init = (callback) => {
    // Start server
    server.init();
    // Start workers
    workers.init();
    // Start CLI, but make sure it starts last
    setTimeout(() => {
        cli.init();
        if (typeof callback === "function") callback();
    }, 50);
};

// Self invoking only if required directly
if (require.main === module) app.init();

module.exports = app;
