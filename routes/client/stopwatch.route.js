const express = require('express');
const router = express.Router();

const controller = require("../../controllers/client/stopwatch.controller");

router.get("/", controller.index);

module.exports = router;