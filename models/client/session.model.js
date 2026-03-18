const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
    mode: {
        type: String,
        enum: ["Pomodoro", "Short Break", "Long Break", "Stopwatch"],
        required: true,
        default: "Pomodoro"
    },
    
    startTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    
    endTime: {
        type: Date,
        required: true
    },
    
    // Tổng số GIÂY thực tế đã chạy. 
    totalDuration: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },

    taskText: {
        type: String,
        trim: true,
        default: ""
    },
    
    note: {
        type: String,
        trim: true
    }
}, { 
    timestamps: true 
});

sessionSchema.index({ userId: 1, createdAt: -1 });

const Session = mongoose.model("Session", sessionSchema, "sessions");
module.exports = Session;