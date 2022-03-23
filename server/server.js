const express = require("express");
const http = require("http");
const socketIO= require("socket.io");
const cors = require('cors')

const app = express();
app.use(cors())
const server = http.createServer(app);
const io = socketIO(server,{
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

const port = process.env.port || 3001

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

io.on("connection", (socket) => {
    console.log("User connected: " + socket.id);

    socket.on('disconnect' , () => {
        console.log('User ' + socket.id + ' disconnected')
    })
});


  
  

