const express = require("express"),
	router = express.Router(),
        url = require("url")

// configure routers
router.use("/app", require("./page"))
router.use("/goapi", require("./theme"))

// logs
router.use((req, res) => {
	try {
		const p = url.parse(req.url, true);
		if (req.url == "/") res.statusCode = 304;
		console.log(req.method, p.path, "-", res.statusCode);
	} catch (x) {
		res.statusCode = 500;
		const p = url.parse(req.url, true);
		if (req.url == "/") res.statusCode = 304;
		console.log(req.method, p.path, "-", res.statusCode);
		res.send(x)
	}
})

module.exports = router
