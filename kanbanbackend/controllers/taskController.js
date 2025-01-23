const User = require("../models/userModel");
const Task = require("../models/taskModel");
const Project = require("../models/projectModel");
const { logActivity } = require("./activityLogController");
const activityLogModel = require("../models/activityLogModel");
const Notification = require("../models/notificationModel")
const { notifyTaskUpdate, notifyTaskManager } = require("../utils/notificationHelper");

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("dependencies")
      .populate("assignedTo");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markTaskComplete = async (req, res) => {
  try {
    const {taskId} = req.params;

    const task = await Task.findById(taskId).populate('dependencies');
    if(!tasks) {
      return res.status(404).json({message: 'Task not found'});
    }

    const unresolvedDependencies = task.dependencies.filter(dep => dep.status !== 'done');
    if(unresolvedDependencies.length > 0) {
      return res.status(400).json({message: 'Unresolved dependencies', unresolvedDependencies});
    }

    task.status = 'done';
    await task.save();

    res.status(200).json({task});
  } catch(error) {
    res.status(500).json({message: error.message});
  }
}

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("dependencies")
      .populate("assignee");
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      assignedTo,
      projectId,
      dueDate,
      status,
      dependencies = [],
    } = req.body;
    const newTask = new Task({
      title,
      description,
      priority,
      assignedTo,
      projectId,
      dueDate,
      status,
      dependencies: Array.isArray(dependencies) ? dependencies : JSON.parse(dependencies),
      attachment: req.file
        ? req.file.filename
        : null,
    });

    await newTask.save();
    const user = await User.findById({_id: req.user._id});
    console.log(user);
    await notifyTaskUpdate(newTask, `New task created by ${user.username}`);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasksAssigned = async (req, res) => {
  console.log("Reached controller");
  try {
    const userId = req.user._id; // Assuming the user's ID is available in req.user
    console.log(userId);
    const tasks = await Task.find({ assignedTo: userId }).populate("projectId");
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getTasksByManagerProject = async (req, res) => {
  try {
    const managerId = req.user._id; // Assuming the user's ID is available in req.user

    // Find the project managed by the logged-in manager
    const project = await Project.findOne({ assignedManager: managerId });
    if (!project) {
      return res
        .status(404)
        .json({ message: "No project found for this manager" });
    }

    // Fetch tasks for the found project
    const tasks = await Task.find({ projectId: project._id }).populate(
      "projectId"
    );
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getTaskByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ projectId });
    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    try {
      await activityLogModel.create({
        taskId: updatedTask._id,
        userId: req.user._id,
        action: "Task Updated",
      });
      console.log("activitylog entry done");
    } catch (error) {
      console.log("error logging", error);
    }

    const role = req.user.role;
    const user = await User.findById({_id: req.user._id});
    if(role === "user") {
      const projectId = updatedTask.projectId;
      const project = await Project.find({_id: projectId});

      await notifyTaskManager({managerId: project[0].assignedManager, task: updatedTask, message: `Task updated by ${user.username}`});
    }
    else {
      await notifyTaskUpdate(updatedTask, `Task updated by ${user.username}`);
    }
    
    if (updatedTask) {
      res.status(200).json(updatedTask);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ assignedTo: userId });
    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (deletedTask) {
      await activityLogModel.create({
        taskId: deletedTask._id,
        userId: req.user._id,
        action: "Task Deleted",
      });
      //remove task from associated project
      const projectObj = await Project.findById(deletedTask.projectId);
      if (projectObj) {
        projectObj.tasks = projectObj.tasks.filter(
          (taskId) => taskId.toString() !== req.params.id
        );
        await projectObj.save();
      }
      res.status(200).json({ message: "Task deleted" });
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addDependency = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      task.dependencies.push(req.body.dependency);
      const updatedTask = await task.save();
      res.status(200).json(updatedTask);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  addDependency,
  getTaskByProjectId,
  getTasksByManagerProject,
  getUserTasks,
  markTaskComplete,
  getTasksAssigned,
};
