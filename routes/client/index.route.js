const homeRoutes = require("./home.route");
const pomodoroRoutes = require("./pomodoro.route");
const stopwatchRoutes = require("./stopwatch.route");
const apiRoutes = require("./api.route");
const authRoutes = require("./auth.route");
const userMiddleware = require("../../middlewares/client/user.middleware"); 

module.exports = (app) => {

    app.use(userMiddleware.infoUser);
    
    app.use("/", homeRoutes);
    app.use("/pomodoro", pomodoroRoutes);
    app.use("/stopwatch", stopwatchRoutes);
    app.use("/api", apiRoutes);
    app.use("/", authRoutes);
};