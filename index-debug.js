// Dependencies
const server = require("./lib/server");
const workers = require("./lib/workers");
const cli = require("./lib/cli");
const exampleDebuggingProblem = require("./lib/exampleDebuggingProblem");

const app = {};

app.init = () => {
    // Start server
    debugger;
    server.init();
    debugger;
    // Start workers
    debugger;
    workers.init();
    debugger;
    // Start CLI, but make sure it starts last
    debugger;
    setTimeout(() => cli.init(), 50);
    debugger;

    let foo = 2;
    console.log("Place 1");
    debugger;

    foo++;
    console.log("Place 2");

    debugger;
    foo = foo * foo;
    console.log("Place 3");

    debugger;
    foo = foo.toString();
    console.log("Place 4");
    debugger;
    // Some other thing here
    // Call the init script that will throw an error
    exampleDebuggingProblem.init();
    console.log("Place 5");

    debugger;
};

app.init();

module.exports = app;
