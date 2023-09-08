// Example UDP server

const dgram = require("dgram");

// Create server
const server = dgram.createSocket("udp4");

server.on("message", (msgBuffer, sender) => {
    // Do something with the incoming message, or do something with the sender
    const msg = msgBuffer.toString();
    console.log(msg);
});

server.bind(6000);
