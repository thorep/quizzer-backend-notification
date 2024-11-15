const express = require('express');
const http = require('http');
const cors = require('cors');
const { initSocketIO } = require('./socketManager');
const { routes } = require('./routes');

// Create an Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors({ origin: '*' })); // Allow all origins for simplicity

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initSocketIO(server);

// Define routes
app.use('/', routes);

// Start the server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
