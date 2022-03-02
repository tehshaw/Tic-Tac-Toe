const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
    console.log(socket.id);
});

httpServer.listen(3001, () => {
    console.log('listening on port 3000');
});
  
  

