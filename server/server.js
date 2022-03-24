const express = require("express");
const http = require("http");
const socketIO= require("socket.io");
const cors = require('cors')
const { randomUUID } = require('crypto')

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

let singleRooms = []

io.on("connection", (socket) => {

    let myRoom = ''

    if(singleRooms.length > 0){
        myRoom = singleRooms[0]
        socket.join(myRoom)
        singleRooms.shift()
        io.in(myRoom).emit('message', "Player " + socket.id + " joined the room.")
        io.in(myRoom).emit('message', "Game will start momentarily.")
        startGame(myRoom)
        console.log(io.sockets.adapter.rooms)
    }else{
        myRoom = randomUUID()
        singleRooms.push(myRoom)
        socket.join(myRoom)
        io.in(myRoom).emit('message', "Player " + socket.id + " joined room " + myRoom)
        io.in(myRoom).emit('message', "Waiting for another player")
        console.log(io.sockets.adapter.rooms)
    }

    socket.on('move', (args) =>{
        console.log(args)
        io.in(args.room).emit('move', args.move)
    })

    socket.on('disconnect' , () => {
        console.log('User ' + socket.id + ' disconnected')
    })

});

function startGame(room){
    

}

function getRoom(socketID){
    const arr = Array.from(io.sockets.adapter.rooms)
    const myRoom = arr.filter(room => room[0] !== socketID)
    console.log(myRoom)
    return users
}




  
  

