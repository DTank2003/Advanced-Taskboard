const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
const User = require('../models/userModel'); // Assuming you have a User model

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('assignedManager').populate('createdBy');
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProjectAnalytics = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Get tasks for the project 
    const tasks = await Task.find({ projectId });

    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks found for this project" });
    }

    // Calculate analytics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === "done").length;
    const pendingTasks = totalTasks - completedTasks;

    const priorityCounts = tasks.reduce(
      (acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
      },
      { low: 0, medium: 0, high: 0 }
    );

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      priorityCounts,
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProjectsByAdmin = async (req, res) => {
    try {
      const adminId = req.user._id; // Assuming req.user contains the authenticated user's info
      const projects = await Project.find({ createdBy: adminId })
      .populate('assignedManager', 'username') // Populate the assignedManager field with the username
      
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

const getProjectsByManager = async (req, res) => {
    try {
        const managerId = req.user._id; // Assuming the manager's ID is available in req.user
        const projects = await Project.find({ assignedManager: managerId }).populate('tasks');
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getManagersWithNoProjects = async (req, res) => {
    console.log("i was called");
    try {
        const projects = await Project.find().select('assignedManager');
        //console.log(projects);
        const assignedManagers = projects.map(project => project.assignedManager);
        console.log(assignedManagers);
        const managersWithNoProjects = await User.find({
            _id: { $nin: assignedManagers },
            role: 'manager' // Assuming you have a role field to identify managers
        });
        console.log(managersWithNoProjects);
        res.status(200).json(managersWithNoProjects);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('assignedManager').populate('createdBy');
        if (project) {
            res.status(200).json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProject = async (req, res) => {
    const { name, description, assignedManager, dueDate } = req.body;

    try {
        const newProject = new Project({ name, description, createdBy: req.user._id, assignedManager, dueDate });
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedProject) {
            res.status(200).json(updatedProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        
        await Task.deleteMany({projectId: req.params.id});
        
        if (deletedProject) {
            res.status(200).json({ message: 'Project deleted' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addTeamMember = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        project.assignedManager = req.body.assignedManager;
        await project.save();
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProjects,
    getProjectById,
    getManagersWithNoProjects,
    createProject,
    updateProject,
    getProjectsByManager,
    deleteProject,
    getProjectAnalytics,
    getProjectsByAdmin,
    addTeamMember,
};