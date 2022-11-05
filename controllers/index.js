const express = require("express"),
	router = express.Router()  

// configure routers
router.use("/app", require("./page"))

module.exports = router
