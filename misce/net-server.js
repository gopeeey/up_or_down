// Example TCP (Net) Server
// Listens to port 6000 and sends the word pong to clients

const net = require("net");

// Create server
const server = net.createServer((connection) => {
    // Send the word pong
    const outboundMessage = "pong";
    connection.write(outboundMessage);

    // When the client writes something, log it out
    connection.on("data", (data) => {
        const inboundMessage = data.toString();
        console.log(inboundMessage);
    });
});

server.listen(6000);
