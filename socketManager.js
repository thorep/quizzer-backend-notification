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
        // Extract userId from the query parameters
        const userId = socket.handshake.query.playerId;

        if (!userId) {
            console.log('Connection attempted without a userId. Disconnecting.');
            socket.disconnect(); // Disconnect if no userId is provided
            return;
        }

        // Register the user
        userSockets[userId] = socket.id;
        console.log(`User connected: ${userId} -> ${socket.id}`);

        // Handle disconnection
        socket.on('disconnect', () => {
            delete userSockets[userId];
            console.log(`User disconnected: ${userId}`);
        });

        // Example: Handle custom events
        socket.on('customEvent', (data) => {
            console.log('Received customEvent:', data);
        });
    });
};

// Broadcast a message to a specific user
const sendMessageToUser = (userId, type, data) => {
    const socketId = userSockets[userId];
    if (socketId) {
        io.to(socketId).emit(type, data);
        console.log(`Message sent to user ${userId}: ${data}. Type: ${type}`);
    } else {
        console.log(`User ${userId} is not connected.`);
    }
};

module.exports = { initSocketIO, sendMessageToUser };
