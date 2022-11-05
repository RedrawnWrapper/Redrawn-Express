const express = require("express"),
	router = express.Router(),
        url = require("url");


// configure routers
router.use("/app", require("./page"))
router.get('/', (req, res) => {
	req.query = url.query;
	const p = url.parse(req.url, true);
	if (req.url == "/") res.statusCode = 304;
	console.log(req.method, p.path, "-", res.statusCode);
	res.send('Hello, Anistick Studio Online is currently in beta. i know that its dead lol, but i just felt like trying something new.')
})

module.exports = router
