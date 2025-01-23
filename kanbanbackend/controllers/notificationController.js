//const Notification = require("../models/Notification");
const Notification = require("../models/notificationModel");

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId, read: false }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;
    const notification = new Notification({
      userId,
      message,
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error("Failed to create notification:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};