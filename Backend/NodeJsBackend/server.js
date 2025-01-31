const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Initialize Socket.IO
const io = socketIo(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173",
    }
});
// Socket.IO event handlers
io.on('connection', (socket) => {
    // console.log('New WebSocket connection established');
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    // Event for sending a message
    socket.on('message', ({ room, message }) => {
        console.log(`Message in room ${room}: ${message}`);

        // Broadcast message to all users in the room
        io.to(room).emit('message', { user: socket.id, message });
    });

    socket.on('vote', (data) => {
        // Broadcast the vote to all clients in the room
        io.to(data.option.message.room.roomId).emit('vote', data);
    });

    socket.on('rejectUser', (data) => {
        io.to(data.roomId).emit('rejectUser', data);
    });

    socket.on('acceptUser', (data) => {
        io.to(data.roomId).emit('acceptUser', data);
    });

    socket.on("renameGroup", (data) => {
        io.to(data.roomId).emit("renameGroup", data);
    });

    socket.on("endGroup", (data) => {
        io.to(data.roomId).emit("endGroup", data);
    });

    socket.on('like', (data) => {
        // Broadcast the like to all clients in the room
        io.to(data.message.room.roomId).emit('like', data);
    });

    socket.on('unlike', (data) => {
        // Broadcast the unlike to all clients in the room
        io.to(data.message.room.roomId).emit('unlike', data);
    });

    socket.on('leaveRoom', (roomId) => {
        socket.leave(roomId);
        console.log(`User ${socket.id} left room: ${roomId}`);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});



// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});