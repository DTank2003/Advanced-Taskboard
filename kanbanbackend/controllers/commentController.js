const Comment = require("../models/commentModel");
const Task = require("../models/taskModel");

// Get all comments for a specific task
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId })
      .populate("userId", "username")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments." });
  }
};

// Create a new comment
const createComment = async (req, res) => {
  const { taskId, text } = req.body;
  const userId = req.user._id;
  if (!taskId || !userId || !text) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newComment = new Comment({ taskId, userId, text });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment." });
  }
};

module.exports = {
  getAllComments,
  createComment,
};
