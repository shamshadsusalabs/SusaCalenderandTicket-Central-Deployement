const express = require('express');
const router = express.Router();
const Chat = require('../schema/Chat');



router.post('/start', async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        console.log(`Starting chat between sender: ${senderId} and receiver: ${receiverId}`);

        // Ensure senderId is always less than receiverId for consistent comparison
        const participants = [senderId, receiverId].sort(); // Sort IDs to maintain consistency
        console.log('Sorted participants:', participants);

        // Check if the chat already exists
        const existingChat = await Chat.findOne({
            participants: { $all: participants },
            $expr: { $eq: [ { $size: "$participants" }, 2 ] } // Ensure there are exactly 2 participants
        });

        if (existingChat) {
            console.log('Chat already exists:', existingChat);
            return res.status(200).json(existingChat); // Return existing chat
        }

        // Create a new chat if it doesn't exist
        const chat = new Chat({ participants, messages: [] });
        await chat.save();
        console.log('Chat started successfully:', chat);
        res.status(201).json(chat);
    } catch (error) {
        console.error('Error starting chat:', error);
        res.status(500).json({ error: 'Failed to start chat' });
    }
});





module.exports = router;