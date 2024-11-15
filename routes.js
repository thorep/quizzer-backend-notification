const express = require('express');
const { sendMessageToUser } = require('./socketManager');

const router = express.Router();

// Route to send a message to a specific user
router.post('/send', (req, res) => {
    const { userId, data, type } = req.body;

    if (!userId || !data || !type) {
        return res.status(400).json({ error: 'UserId, message, and type are required' });
    }

    try {
        sendMessageToUser(userId, type, message);
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

module.exports = { routes: router };
