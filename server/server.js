const express = require("express");
const http = require("http");
const socketIO= require("socket.io");
const cors = require('cors')
const { randomUUID } = require('crypto');
const { Console } = require("console");
const { ok } = require("assert");

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

    console.log(socket.id + " connected")

    socket.emit('rooms', getActiveRooms())

    // if(singleRooms.length > 0){
    //     myRoom = singleRooms[0]
    //     socket.join(myRoom)
    //     singleRooms.shift()
    //     io.in(myRoom).emit('message', "Player " + socket.id + " joined the room.")
    //     io.in(myRoom).emit('message', "Game will start momentarily.")
    //     startGame(myRoom)
    //     console.log(io.sockets.adapter.rooms)
    // }else{
    //     myRoom = randomUUID()
    //     singleRooms.push(myRoom)
    //     socket.join(myRoom)
    //     io.in(myRoom).emit('message', "Player " + socket.id + " joined room " + myRoom)
    //     io.in(myRoom).emit('message', "Waiting for another player")
    //     console.log(io.sockets.adapter.rooms)
    // }

    socket.on('move', (args, callback) =>{
        let room = getMyRoom(socket)
        socket.to(room).emit('move', args)
        callback({
            status: 'received move'
        })
    })

    socket.on('disconnect' , () => {
        console.log('User ' + socket.id + ' disconnected')
    })

    socket.on('create', () => {
        let newRoom = randomUUID()
        socket.join(newRoom)
        console.log(socket.id + " created new room. ROOM: " + newRoom)
        socket.broadcast.emit('rooms', getActiveRooms())
    })

    socket.on('leave', () => {
        let myRoom = getMyRoom(socket)
        io.in(socket.id).socketsLeave(myRoom)
        io.emit('rooms', getActiveRooms())
    })

    socket.on('report', () => {
        socket.emit('message', {activeRooms: '', rooms:getActiveRooms()})
        socket.emit('message', {gameRooms: '', rooms:getMyRoom(socket)})
        socket.emit('message', {socketRooms: '' , rooms:Array.from(socket.rooms)})
        socket.emit('message', {allRooms: '', rooms: Array.from(io.sockets.adapter.rooms)})
        socket.emit('message', {allUsers: '', rooms: Array.from(io.sockets.adapter.sids)})
    })

});

function startGame(room){


}

function getActiveRooms() {
    const arr = Array.from(io.sockets.adapter.rooms);
    const filtered = arr.filter(room => !room[1].has(room[0]))
    const res = filtered.filter(i => i[1].size === 1);
    const r = res.map(r => r[0])
    // console.log("all rooms", res)
    return r;
}

function getMyRoom(socket){
    const rooms = Array.from(socket.rooms)
    // console.log(rooms, socket.id)
    const myRoom = rooms.filter(room => room !== socket.id)
    // console.log("myRoom", myRoom)
    return myRoom
}




  
  

