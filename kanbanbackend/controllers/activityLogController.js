const activityLogModel = require('../models/activityLogModel');
const ActivityLog = require('../models/activityLogModel');

const getActivityLogs = async (req, res) => {
    try {
        const {taskId} = req.params;

        const logs = await activityLogModel.find({taskId})
        .populate("userId", "username")
        .sort({timestamp: -1});
        res.json(logs);
    } catch(error) {
        console.error("Error fetching logs: ", error);
        res.status(500).json({error: "Server error"});
    }
};

module.exports = { getActivityLogs };