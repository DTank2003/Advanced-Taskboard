const Message = require('../models/messageModel');
// Send message and emit event to both sender and receiver
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    const message = new Message({
      senderId,
      receiverId,
      text,
      timestamp: new Date(),
    });
    await message.save();
    
    // Emit to both sender and receiver
    req.io.emit(`new_message_${senderId}`, message); // Emit to sender
    req.io.emit(`new_message_${receiverId}`, message); // Emit to receiver

    return res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
};

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

module.exports = { getChatHistory, sendMessage, saveMessage };
