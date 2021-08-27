const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});

const users = [];
const messages = [];

io.on('connection', socket => {
  console.log(`Socket conectado: ${socket.id}`);

  socket.on('userActive', user => {
    users.push({
      id: socket.id,
      userName: user
    });

    io.emit('activeUsers', users);

    socket.on('sendMessage', data => {
      
      messages.push(data);
            
      socket.broadcast.emit('receivedMessages', messages);
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });

});

server.listen(process.env.PORT || 8080);