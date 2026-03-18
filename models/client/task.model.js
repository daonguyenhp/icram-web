const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    text: {
        type: String,
        required: [true, "Task text is required"],
        trim: true
    },

    status: {
        type: String,
        default: "pending",
        enum: ["pending", "in-progress", "completed", "archived"] // Các trạng thái cho phép
    },

    category: {
        type: String,
        default: "today"
    }
}, {
    // Tự động sinh ra hai trường createAt và UpdateAt
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema, "tasks");

module.exports = Task;