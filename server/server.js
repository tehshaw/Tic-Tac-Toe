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

    if(singleRooms.length() > 0){
        myRoom = singleRooms[0]
        socket.join(myRoom)
        singleRooms.shift()
    }else{
        myRoom = randomUUID()
        singleRooms.push(myRoom)
        socket.join(myRoom)
    }

    io.to(socket.id).emit('room', myRoom)

    socket.on('move', (args) =>{
        console.log(args)
        io.in(args.room).emit('move', args.move)
    })

    socket.on('disconnect' , () => {
        console.log('User ' + socket.id + ' disconnected')
    })

});

function usersInRoom(io, roomID){
    const arr = Array.from(io.sockets.adapter.rooms)
    const myRoom = arr.filter(room => room[0] === roomID)
    const users = myRoom[0][1].values()
    return users
}




  
  

