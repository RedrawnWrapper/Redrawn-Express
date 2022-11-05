const express = require("express"),
	router = express.Router(),
        url = require("url");


// configure routers
router.use("/app", require("./page"))

module.exports = router
