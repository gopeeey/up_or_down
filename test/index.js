// Test Runner

// Application logic for the test runncer
_app = {};

// Container for the tests
_app.tests = {};

// Add on unit tests
_app.tests.unit = require("./unit");

// Count all the tests
_app.countTests = () => {
    let counter = 0;
    for (const key in _app.tests) {
        if (!_app.tests.hasOwnProperty(key)) continue;
        const subTests = _app.tests[key];
        for (const testName in subTests) {
            if (!subTests.hasOwnProperty(testName)) continue;
            counter++;
        }
    }

    return counter;
};

// Produces a test outcome report
_app.produceTestReport = (limit, successes, errors) => {
    console.log("");
    console.log("--------------BEGIN TEST REPORT------------------");
    console.log("");
    console.log("Total Tests:", limit);
    console.log("Passed:", successes);
    console.log("Fails:", errors.length);
    console.log("");

    // If there are errors, print them in detail
    if (errors.length > 0) {
        console.log("\n\n----------------BEGIN ERROR DETAILS-----------------\n\n");

        errors.forEach((testErr) => {
            console.log("\x1b[31m%s\x1b[0m", testErr.name);
            console.log(testErr.error);
        });
        console.log("\n\n----------------END ERROR DETAILS-----------------\n\n");
    }

    console.log("\n\n----------------END TEST REPORT-----------------");
};

// Run all tests collecting errors and successes
_app.runTests = () => {
    const errors = [];
    let successes = 0;
    let limit = _app.countTests();
    let counter = 0;
    for (const key in _app.tests) {
        if (!_app.tests.hasOwnProperty(key)) continue;
        const subTests = _app.tests[key];

        for (const testName in subTests) {
            if (!subTests.hasOwnProperty(testName)) continue;
            (() => {
                const tmpTestName = testName;
                const testValue = subTests[testName];

                // Call the test
                try {
                    testValue(() => {
                        // If it calls back without throwing, then it succeeded, log it in green
                        console.log("\x1b[32m%s\x1b[0m", tmpTestName);
                        counter++;
                        successes++;
                        if (counter === limit) _app.produceTestReport(limit, successes, errors);
                    });
                } catch (err) {
                    // if it throws, then it failed, so capture the error thrown and log it in red
                    errors.push({
                        name: testName,
                        error: err,
                    });
                    console.log("\x1b[31m%s\x1b[0m", tmpTestName);
                    counter++;
                    if (counter === limit) _app.produceTestReport(limit, successes, errors);
                }
            })();
        }
    }
};

_app.runTests();
