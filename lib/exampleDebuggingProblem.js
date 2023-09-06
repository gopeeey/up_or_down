// This is a library that throws an error everytime the init function is called

// Container
const example = {};

example.init = () => {
    // This reference error was created intentionally
    const foo = bar;
};

module.exports = example;
