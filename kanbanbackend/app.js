const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/activity-logs', require('./routes/activityLogRoutes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;