const express = require("express");
const http = require("http");
const socketIO= require("socket.io");
const cors = require('cors')
const { randomUUID } = require('crypto');

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

    socket.on('join', (args) =>{
        socket.join(args.room)
        socket.to(args.room).emit('message', socket.id + " has joined the room")
        console.log(`socket ${socket.id} has joined room ${args.room}`);
        startGame(args.room)


    })

    socket.on('move', function (args, callback) {
        console.log(args)
        let room = getMyRoom(socket)
        io.in(room).emit('move', args)
        callback({
            status: 'received move'
        })
    })

    socket.on('disconnect' , () => {
        console.log('User ' + socket.id + ' disconnected')
        socket.emit('rooms', getActiveRooms())
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
        console.log(socket._events)
        socket.emit('message', {activeRooms: '', rooms:getActiveRooms()})
        socket.emit('message', {gameRooms: '', rooms:getMyRoom(socket)})
        socket.emit('message', {socketRooms: '' , rooms:Array.from(socket.rooms)})
        socket.emit('message', {allUsers: '', rooms: Array.from(io.sockets.adapter.sids)})
        socket.emit('message', (Array.from(io.sockets.adapter.rooms)))
    })

});

async function startGame(room){
    const players = await io.in(room).fetchSockets()
    const playerX = Math.floor(Math.random()*2)
    setTimeout(() => {
        io.in(room).emit('ready')
        setTimeout(() => {
            if(playerX === 0){
                io.to(players[0].id).emit('myMove', 'X')
                io.to(players[1].id).emit('myMove', 'O')
            }else{
                io.to(players[1].id).emit('myMove', 'X')
                io.to(players[0].id).emit('myMove', 'O')
            }
        }, 2000);
    }, 1000);
    

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




  
  

