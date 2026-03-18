const express = require('express');
const router = express.Router();

const taskRoutes = require("./task.route");
const sessionRoutes = require("./session.route");

const apiController = require("../../controllers/client/api.controller");

// Import middleware xác thực (Để đảm bảo chỉ người dùng đã login mới gọi được API)
const authMiddleware = require("../../middlewares/client/auth.middleware");

router.use("/tasks", authMiddleware.requireAuth, taskRoutes);
router.use("/sessions", authMiddleware.requireAuth, sessionRoutes);

router.get("/dashboard-stats", apiController.getDashboardStats);
router.patch("/settings/update", apiController.updateSettings);

module.exports = router;