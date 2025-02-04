const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/messageModel');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for private chat messages
  socket.on('send_message', async (messageData) => {
    console.log('Message received:', messageData);

    try {
      // Save message to MongoDB
      const message = new Message(messageData);
      await message.save();

      // Emit message to specific user
      io.to(messageData.receiverId).emit('receive_message', messageData);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/activity-logs', require('./routes/activityLogRoutes'));

// Start server with WebSocket
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, io };
