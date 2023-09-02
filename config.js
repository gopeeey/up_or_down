// Create and export configuration variables

// Container for all the environments
const environments = {};

// Staging (default) environment
environments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: "staging",
    hashingSecret: "shhhhhhhhhh",
    maxChecks: 5,
    twilio: {
        accountSid: "AC8df11d0532e1145a79b5688306409157",
        authToken: "469f01ad3735d499fa5aa382ea101fef",
        fromPhone: "+17069433358",
    },
    templateGlobals: {
        appName: "Uptime checker",
        companyName: "NotARealCompany, Inc",
        yearCreated: "2023",
        baseUrl: "http://localhost:3000",
    },
};

// Production environment
environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: "production",
    hashingSecret: "shhhhhhhhhhaaaaaa",
    maxChecks: 5,
    twilio: {
        accountSid: "AC8df11d0532e1145a79b5688306409157",
        authToken: "469f01ad3735d499fa5aa382ea101fef",
        fromPhone: "+17069433358",
    },
    templateGlobals: {
        appName: "Uptime checker",
        companyName: "NotARealCompany, Inc",
        yearCreated: "2023",
        baseUrl: "http://localhost:5000",
    },
};

// Determine which environment was passed as a command-line argument
const currentEnvironment =
    typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV.toLowerCase() : "";

// Check that the currenct environment is one of the environments above,
// if not, default to staging
let env = environments[currentEnvironment];
if (!env) env = environments.staging;

module.exports = env;
