const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    priority: {
        type: String,
        enum: ["low","medium","high"],
        default: "medium",
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
    },
    status: {
        type: String,
        enum: ["todo","inprogress","done"],
        default: "todo",
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    dueDate: {
        type: Date,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    dependencies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
        },
    ],
    attachment: {
        // fileName: String,
        // filePath: String,
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
},
    {timestamps: true}
);

module.exports = mongoose.model("Task", taskSchema);