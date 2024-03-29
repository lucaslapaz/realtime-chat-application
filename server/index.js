const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users.js");

const PORT = process.env.PORT || 5000;
const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) {
      socket.disconnect();
      return callback({error});
    }

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, bem vindo a sala ${user.room}`,
    });

    socket.broadcast.to(user.room).emit("message", { user: "admin", text: `${user.name} entrou na sala!` });

    socket.join(user.room);

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)})

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('message', {user: user.name, text: message});
    callback();
  })

  socket.on("disconnect", (e) => {
    const user = removeUser(socket.id);
    if(user){
      io.to(user.room).emit('message', {user: 'admin', text: `${user.name} saiu.`})/
      io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)});
    }
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`));
