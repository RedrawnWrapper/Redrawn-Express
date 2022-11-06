const express = require("express"),
	router = express.Router()

// configure routers
router.use("/app", require("./page"))
router.use("/goapi", require("./theme"))
router.use("/goapi", require("./asset"))
router.use("/goapi", require("./movie"))

module.exports = router
