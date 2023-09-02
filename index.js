// Dependencies
const server = require("./lib/server");
const workers = require("./lib/workers");
const cli = require("./lib/cli");

const app = {};

app.init = () => {
    // Start server
    server.init();
    // Start workers
    workers.init();
    // Start CLI, but make sure it starts last
    setTimeout(() => cli.init(), 50);
};

app.init();

module.exports = app;
