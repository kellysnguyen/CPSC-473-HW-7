/* eslint-env node*/

var WebSocket = require("ws");
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
  port: port
});

//Messages array holds all messages in conversation
var messages = [];
console.log("websockets server started");

ws.on("connection", function(socket) {
  console.log("client connection established");
  //Send entire contents of messages array to new client
  messages.forEach(function(msg) {
    socket.send(msg);
  });

  socket.on("message", function(data) {
    //Regular message, log to server
    console.log("message received: " + data);
    //Add new message to array
    messages.push(data);
    //Send the message to each client
    ws.clients.forEach(function(clientSocket) {
      clientSocket.send(data);
    });
  });
});
