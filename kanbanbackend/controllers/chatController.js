const Message = require('../models/messageModel');

// Get chat history between two users
const getChatHistory = async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    }).sort('timestamp');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Save message to the database (Used if sending messages via API instead of WebSocket)
const saveMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' });
  }
};

module.exports = { getChatHistory, saveMessage };
