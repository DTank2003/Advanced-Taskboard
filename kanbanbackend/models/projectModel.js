const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
        },
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    assignedManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    dueDate: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model("Project", projectSchema);