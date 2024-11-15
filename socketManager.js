const { Server } = require('socket.io');

let io;

// In-memory mapping of userId to socketId
const userSockets = {};

const initSocketIO = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*', // Allow all origins
        },
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Handle user registration
        socket.on('register', (userId) => {
            userSockets[userId] = socket.id;
            console.log(`User registered: ${userId} -> ${socket.id}`);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            const userId = Object.keys(userSockets).find(key => userSockets[key] === socket.id);
            if (userId) {
                delete userSockets[userId];
                console.log(`User disconnected: ${userId}`);
            }
            console.log('A user disconnected:', socket.id);
        });

        // Example: Handle custom events
        socket.on('customEvent', (data) => {
            console.log('Received customEvent:', data);
        });
    });
};

// Broadcast a message to a specific user
const sendMessageToUser = (userId, type, message) => {
    const socketId = userSockets[userId];
    if (socketId) {
        io.to(socketId).emit(type, message);
        console.log(`Message sent to user ${userId}: ${message}`);
    } else {
        console.log(`User ${userId} is not connected.`);
    }
};

module.exports = { initSocketIO, sendMessageToUser };
