const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/task.controller");

router.get("/", controller.getTasks);             // GET /api/tasks
router.post("/create", controller.create);        // POST /api/tasks/create
router.patch("/edit/:id", controller.edit);       // PATCH /api/tasks/edit/:id
router.delete("/delete/:id", controller.delete);  // DELETE /api/tasks/delete/:id

module.exports = router;