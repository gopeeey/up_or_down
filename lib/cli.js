/*
 *
 *   CLI-Related tasks
 *
 */

const readline = require("readline");
const util = require("util");
const debug = util.debuglog("cli");
const events = require("events");
const os = require("os");
const v8 = require("v8");
const _data = require("./data");
const _logs = require("./logs");
const helpers = require("./helpers");
const childProcess = require("child_process");

class _events extends events {}
const e = new _events();

// Instantiate the cli module object
const cli = {};

// Input handlers
e.on("man", (str) => cli.responders.help());

e.on("help", (str) => cli.responders.help());

e.on("exit", (str) => cli.responders.exit());
e.on("clear", () => cli.responders.clear());
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
    const commands = {
        exit: "Kill the entire application",
        man: "Show this help page",
        help: "Alias of the man command",
        stats: "Get statistics on the underlying OS and resource utilization",
        "list users": "Show a list of all the registered users",
        "more user info --{userId}": "Show details of a specific user",
        "list checks --up --down":
            "Show a list of all the active checks in the system including their state. The --up and --down are optional",
        "more check info --{checkId}": "Show details of a specific check",
        "list logs": "Show a list of all log files available to be read (compressed only)",
        "more log info --{fileName}": "Show details of a specified log file",
    };

    // Show a header for the help page as wide as the screen
    cli.horizontalLine();
    cli.centered("CLI MANUAL");
    cli.horizontalLine();
    cli.verticalSpace(2);

    // Show each command followed by it's explanation in white and yellow respectively
    for (const key in commands) {
        if (commands.hasOwnProperty(key)) {
            const value = commands[key];
            let line = "\x1b[33m" + key + "\x1b[0m";
            const padding = 60 - line.length;
            for (let i = 0; i < padding; i++) {
                line += " ";
            }
            line += value;
            console.log(line);
            cli.verticalSpace();
        }
    }
    cli.verticalSpace();
    cli.horizontalLine();
};

// Clear
cli.responders.clear = () => console.clear();

// Create vertical space
cli.verticalSpace = (lines) => {
    lines = typeof lines === "number" && lines > 0 ? lines : 1;

    for (let i = 0; i < lines; i++) {
        console.log("");
    }
};

// Create horizontal line across screen
cli.horizontalLine = () => {
    // Get the available screen size
    const width = process.stdout.columns;
    let line = "";

    for (let i = 0; i < width; i++) {
        line += "-";
    }
    console.log(line);
};

cli.centered = (text) => {
    text = typeof text === "string" && text.length ? text : "";

    const width = process.stdout.columns;
    // Calculate left padding
    let leftPadding = Math.floor((width - text.length) / 2);

    // Put in left padded spaces before the text
    let line = "";
    for (let i = 0; i < leftPadding; i++) {
        line += " ";
    }
    line += text;

    console.log(line);
};

// Exit
cli.responders.exit = () => process.exit(0);

// Stats
cli.responders.stats = () => {
    // Compile an object of stats
    let stats = {
        "Load Average": os.loadavg().join(" "),
        "CPU Count": os.cpus().length,
        "Free Memory": os.freemem(),
        "Current Malloced Memory": v8.getHeapStatistics().malloced_memory,
        "Peak Malloced Memory": v8.getHeapStatistics().peak_malloced_memory,
        "Allocated Heap Used (%)": Math.round(
            (v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100
        ),
        "Available Heap Allocated (%)": Math.round(
            (v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100
        ),
        Uptime: os.uptime(),
    };

    // Show a header for the help page as wide as the screen
    cli.horizontalLine();
    cli.centered("STATS");
    cli.horizontalLine();
    cli.verticalSpace(2);

    // Print each line
    for (const key in stats) {
        if (stats.hasOwnProperty(key)) {
            const value = stats[key];
            let line = "\x1b[33m" + key + "\x1b[0m";
            const padding = 60 - line.length;
            for (let i = 0; i < padding; i++) {
                line += " ";
            }
            line += value;
            console.log(line);
            cli.verticalSpace();
        }
    }
    cli.verticalSpace();
    cli.horizontalLine();
};

// List users
cli.responders.listUsers = () => {
    _data.list("users", (err, userIds) => {
        if (err || !userIds || !userIds.length) return;

        cli.verticalSpace();
        userIds.forEach((userId) => {
            _data.read("users", userId, (err, userData) => {
                if (err || !userData) return;

                let line =
                    "Name: " +
                    userData.firstName +
                    " " +
                    userData.lastName +
                    " Phone: " +
                    userData.phone +
                    " Checks: ";
                var numberOfChecks =
                    Array.isArray(userData.checks) && userData.checks.length
                        ? userData.checks.length
                        : 0;
                line += numberOfChecks;
                console.log(line);
                cli.verticalSpace();
            });
        });
    });
};

// More user info
cli.responders.moreUserInfo = (str) => {
    const userId = str.split("--")[1];
    if (!userId || !userId.length) return console.log("Invalid userId");
    _data.read("users", userId, (err, userData) => {
        if (err || !userData) return console.log("User data not found");
        // Remove the hashed password
        delete userData.hashedPassword;

        // Print the JSON object with text highlighting
        cli.verticalSpace();
        console.dir(userData, { colors: true });
        cli.verticalSpace();
    });
};

// List checks
cli.responders.listChecks = (str) => {
    let state = str.split("--")[1];
    _data.list("checks", (err, checkFileNames) => {
        if (err || !checkFileNames) return console.log("Error listing checks", err);
        if (!checkFileNames.length) return console.log("No checks found");
        let checks = [];
        for (const checkFileName of checkFileNames) {
            _data.read("checks", checkFileName, (err, check) => {
                if (err || !check) return;
                let include = false;
                if (check.state === state || !state) {
                    const line = `ID: ${check.id}, ${check.method.toUpperCase()} ${
                        check.protocol
                    }://${check.url} State: ${check.state || "unknown"}`;
                    console.log(line);
                    cli.verticalSpace();
                }
            });
        }
    });
};

// More check info
cli.responders.moreCheckInfo = (str) => {
    const checkId = str.split("--")[1];
    if (!checkId || !checkId.length) return console.log("Invalid checkId");
    _data.read("checks", checkId, (err, checkData) => {
        if (err || !checkData) return console.log("Check data not found");

        // Print the JSON object with text highlighting
        cli.verticalSpace();
        console.dir(checkData, { colors: true });
        cli.verticalSpace();
    });
};

// List logs
cli.responders.listLogs = () => {
    const ls = childProcess.spawn("ls", ["./.logs/"]);
    ls.stdout.on("data", (dataObject) => {
        // Explode into separate lines
        const dataStr = dataObject.toString();
        const logFileNames = dataStr.split("\n");

        cli.verticalSpace();

        for (const logFileName of logFileNames) {
            if (
                !logFileName.includes("-") ||
                typeof logFileName !== "string" ||
                logFileName.length <= 0
            )
                continue;
            console.log(logFileName.trim().split(".")[0]);
            cli.verticalSpace();
        }
    });
};

// More log info
cli.responders.moreLogInfo = (str) => {
    const fileName = str.split("--")[1];
    if (!fileName) return console.log("Invalid fileName");

    cli.verticalSpace();
    _logs.decompress(fileName, (err, stringData) => {
        if (err || !stringData) return console.log("Could not decompress log", err);
        // Split into lines
        const arr = stringData.split("\n");
        arr.forEach((jsonString) => {
            if (!jsonString.length) return;
            const log = helpers.parseJsonToObject(jsonString);
            if (log && JSON.stringify(log) !== "{}") {
                console.dir(log, { colors: true });
                cli.verticalSpace();
            }
        });
    });
};

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
        "clear",
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
