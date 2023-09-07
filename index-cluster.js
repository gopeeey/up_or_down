// Dependencies
const server = require("./lib/server");
const workers = require("./lib/workers");
const cli = require("./lib/cli");
const cluster = require("cluster");
const os = require("os");

const app = {};

app.init = (callback) => {
    if (cluster.isMaster) {
        // If we are on the master thread,
        // Start workers
        workers.init();
        // Start CLI, but make sure it starts last
        setTimeout(() => {
            cli.init();
            if (typeof callback === "function") callback();
        }, 50);

        // Fork the process
        for (let i = 0; i < os.cpus().length; i++) {
            cluster.fork();
        }
    } else {
        // If we're not on the master thread Start server
        server.init();
    }
};

// Self invoking only if required directly
if (require.main === module) app.init();

module.exports = app;
