/*
 *
 *   CLI-Related tasks
 *
 */

const readline = require("readline");
const util = require("util");
const debug = util.debuglog("cli");
const events = require("events");

class _events extends events {}
const e = new _events();

// Instantiate the cli module object
const cli = {};

// Input handlers
e.on("man", (str) => cli.responders.help());

e.on("help", (str) => cli.responders.help());

e.on("exit", (str) => cli.responders.exit());
e.on("stats", (str) => cli.responders.stats());
e.on("list users", (str) => cli.responders.listUsers());
e.on("more user info", (str) => cli.responders.moreUserInfo(str));
e.on("list checks", (str) => cli.responders.listChecks(str));
e.on("more check info", (str) => cli.responders.moreCheckInfo(str));
e.on("list logs", (str) => cli.responders.listLogs());
e.on("more log info", (str) => cli.responders.moreLogInfo(str));

// Responders
cli.responders = {};

// Help / Man
cli.responders.help = () => {
    console.log("hey heeeeey");
};

// Exit
cli.responders.exit = () => process.exit(0);

// Stats
cli.responders.stats = () => {};

// List users
cli.responders.listUsers = () => {};

// More user info
cli.responders.moreUserInfo = (str) => {};

// List checks
cli.responders.listChecks = (str) => {};

// More check info
cli.responders.moreCheckInfo = (str) => {};

// List logs
cli.responders.listLogs = () => {};

// More log info
cli.responders.moreLogInfo = (str) => {};

// Input processor
cli.processInput = (str) => {
    // Sanitize string
    str = typeof str === "string" && str.trim().length ? str : false;

    // Only process input if the use wrote something
    if (!str) return;

    // Codify the unique strings that identify the unique questions that a user is allowed to ask
    const uniqueInputs = [
        "man",
        "help",
        "exit",
        "stats",
        "list users",
        "more user info",
        "list checks",
        "more check info",
        "list logs",
        "more log info",
    ];

    // Go through the possible inputs and emit an event when the match is found
    let matchFound = false;
    uniqueInputs.some((input) => {
        if (str.toLowerCase().startsWith(input)) {
            matchFound = true;
            // Emit an event matching the unique input, and include the full string given
            e.emit(input, str);
            return true;
        }
        return false;
    });

    // If no match found, log an error
    if (!matchFound) return console.log("Sorry, try again");
};

// Init script
cli.init = () => {
    // Send the start messasge to the console in dark blue
    console.log("\x1b[34m%s\x1b[0m", `CLI is running`);

    // Start the interface
    const _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ">",
    });

    // Create an initial prompt
    _interface.prompt();

    // Handle each line of input separately
    _interface.on("line", (str) => {
        // Send to the input processor
        cli.processInput(str);

        // Re-intialize prompt again afterwards
        _interface.prompt();
    });

    // If the user stops the CLI, kill the associated process
    _interface.on("close", () => {
        process.exit(0);
    });
};

module.exports = cli;
