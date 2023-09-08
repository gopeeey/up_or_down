// Example tcp client
// Connects to port 6000 and sends the word ping to the server

const net = require("net");

const outboundMessage = "ping";

// Create client
const client = net.createConnection({ port: 6000 }, () => {
    // Send the message
    client.write(outboundMessage);
});

// When server writes back, log what it says and kill client
client.on("data", (buff) => {
    const inboundMessage = buff.toString();
    console.log(inboundMessage);
    client.end();
});
