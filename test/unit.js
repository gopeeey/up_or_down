// Unit Tests

const helpers = require("../lib/helpers");
const assert = require("assert");
const logs = require("../lib/logs");
const exampleDebuggingProblem = require("../lib/exampleDebuggingProblem");

const unit = {};

// Assert the getANumber function is returning a number
unit["helpers.getANumber should return a number"] = (done) => {
    const val = helpers.getANumber();
    assert.equal(typeof val, "number");
    done();
};

// Assert the getANumber function is returning 1
unit["helpers.getANumber should return a 1"] = (done) => {
    const val = helpers.getANumber();
    assert.equal(val, 1);
    done();
};

// Assert the getANumber function is returning 2
unit["helpers.getANumber should return a 2"] = (done) => {
    const val = helpers.getANumber();
    assert.equal(val, 2);
    done();
};

// Logs.list should call back an array and a false error
unit["logs.list should call back a false error and an array of log names"] = (done) => {
    logs.list(true, (err, logFileNames) => {
        assert.equal(err, false);
        assert.ok(logFileNames instanceof Array);
        assert.ok(logFileNames.length > 1);
        done();
    });
};

// Logs.truncate should not throw even if the logId does not exist
unit["logs.truncate should not thrown even if the logId does not exist"] = (done) => {
    assert.doesNotThrow(() => {
        logs.truncate("Idonotexist", (err) => {
            assert.ok(err);
            done();
        });
    }, TypeError);
};

// ExampleDebuggingProblem.init should not throw when called
unit["exampleDebuggingProblem.init should not throw when called"] = (done) => {
    assert.doesNotThrow(() => {
        exampleDebuggingProblem.init();
        done();
    }, TypeError);
};

module.exports = unit;
