const express = require("express"),
	router = express.Router()  

// configure routers
router.use("/app", require("./page"))
router.use("/goapi", require("./theme"))

module.exports = router
