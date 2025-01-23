const Notification = require("../models/notificationModel");

exports.notifyTaskUpdate = async (task, message) => {
  try {
    const notification = new Notification({
      userId: task.assignedTo,
      message: `${message}: ${task.title}`,
    });
    await notification.save();
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
};

exports.notifyTaskManager = async ({managerId, task, message}) => {
  try {
    const notification = new Notification({
      userId: managerId,
      message: `${message}: ${task.title}`,
    });
    await notification.save();
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
};

exports.notifyDependencyChange = async (task, message) => {
  try {
    if (task.dependencies.length > 0) {
      for (const dependency of task.dependencies) {
        const notification = new Notification({
          userId: dependency.assignedTo,
          message: `Dependency update for task: ${task.title} - ${message}`,
        });
        await notification.save();
      }
    }
  } catch (error) {
    console.error("Failed to send dependency notifications:", error);
  }
};