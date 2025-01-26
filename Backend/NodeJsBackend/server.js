const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const cors = require('cors'); 
// Initialize Express App
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173",  // Allow your React frontend to connect
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true  // If you are using cookies or credentials
    }
});

// Define the API URL for Spring Boot (change this to your actual endpoint)
const SPRING_BOOT_API_URL = 'http://localhost:8081/user/room/message/send';

// Middleware to handle JSON requests
app.use(cors({
    origin: "http://localhost:5173",  // Allow your React frontend to connect
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

// Listen to incoming WebSocket connections
io.on('connection', (socket) => {
    console.log('New WebSocket connection established');

    // Handle 'send_message' event from frontend
    socket.on('send_message', async (messageData) => {
        try {
            io.to(messageData.roomId).emit('message_broadcast', messageData);
            // Call Spring Boot API to handle the message
            // const response = await axios.post(SPRING_BOOT_API_URL, messageData, {
            //     headers: {
            //         'Authorization': `Bearer ${messageData.token}`,
            //     }
            // });

            // // If the message was sent successfully, broadcast to the appropriate room
            // if (response.status === 200) {
            //     io.to(messageData.roomId).emit('message_broadcast', response.data);
            //     console.log('Message broadcasted:', response.data);
            // } else {
            //     console.log('Error sending message:', response.data);
            //     socket.emit('error', 'Error sending message');
            // }
        } catch (error) {
            console.error('Error calling Spring Boot API:', error);
            socket.emit('error', 'Failed to send message');
        }
    });

    // Join a room when the user connects (optional)
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
