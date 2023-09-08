// this is an example UDP client

const dgram = require("dgram");

const client = dgram.createSocket("udp4");

// Define the message and put it into a buffer
const message = "This is a message";
const buff = Buffer.from(message);

// send off the message
client.send(buff, 6000, "localhost", (err) => {
    client.close();
});
