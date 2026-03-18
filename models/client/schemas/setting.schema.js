const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
    focusTime: { type: Number, default: 25 },
    shortBreak: { type: Number, default: 5 },
    longBreak: { type: Number, default: 15 },
    autoStartBreaks: { type: Boolean, default: false },
    autoStartPomodoros: { type: Boolean, default: false },
    
    // Giao diện
    theme: { type: String, default: "light" }
}, {
    _id: false
});

module.exports = settingSchema;