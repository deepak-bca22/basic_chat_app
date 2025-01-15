const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Store the username for this socket
  socket.on('set username', (username) => {
    socket.username = username;
    console.log(`${username} connected with ID: ${socket.id}`);
  });

  // Handle incoming messages
  socket.on('chat message', (data) => {
    console.log(`Message from ${data.username}: ${data.msg}`);

    // Broadcast the message to all clients, including sender
    io.emit('chat message', data);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log(`${socket.username || 'A user'} disconnected.`);
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
