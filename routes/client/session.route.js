const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/session.controller");

router.post("/save", controller.save);            // POST /api/sessions/save
router.get("/history", controller.getHistory);    // GET /api/sessions/history
router.get("/stats-today", controller.getStatsToday); // GET /api/sessions/stats-today
router.get("/stats-7days", controller.getStats7Days); // GET /api/sessions/stats-7days

module.exports = router;