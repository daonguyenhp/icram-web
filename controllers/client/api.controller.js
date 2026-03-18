const User = require("../../models/client/user.model");
const Session = require("../../models/client/session.model");
const Task = require("../../models/client/task.model");

// [GET] /api/dashboard-stats
module.exports.getDashboardStats = async (req, res) => {
    try {
        const userId = res.locals.user.id;

        const taskCount = await Task.countDocuments({
            userId: userId,
            completed: false
        });

        const sessions = await Session.find({userId: userId});
        const totalFocusTime = sessions.reduce((sum, s) => sum + s.totalDuration, 0);

        res.json({
            code: 200,
            taskCount: taskCount,
            totalFocusTime: totalFocusTime, // giây
            message: "Success"
        });
    } catch (e) {
        res.json({ code: 400, message: "Error" });
    }
};

// [PATCH] /api/settings/update
module.exports.updateSettings = async (req, res) => {
    try {
        const userId = res.locals.user.id;
        const settings = req.body; // Nhận { focusTime, shortBreak, ... }

        await User.updateOne(
            { _id: userId },
            { $set: { "settings": settings } }
        );

        res.json({
            code: 200,
            message: "Settings updated!"
        });
    } catch (e) {
        res.json({ code: 400, message: "Update failed" });
    }
};