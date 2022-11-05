// vars
const express = require('express')
const app = express()
const url = require("url")

// env stuff
const env = {
	CHAR_BASE_URL: "https://raw.githubusercontent.com/Anistick/anichars/master/characters",
	THUMB_BASE_URL: "https://raw.githubusercontent.com/Anistick/anithumbs/master/thumbnails",
	XML_HEADER: "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n",
	CROSSDOMAIN: "<cross-domain-policy><allow-access-from domain=\"*\"/></cross-domain-policy>",
	META_FOLDER: "./_ASSETS/meta",
	ASSETS_FOLDER: "./_ASSETS",
	FILE_WIDTH: 1000,
	GATHER_THREADS: 100,
	GATHER_THRESH1: 250000000,
	GATHER_THRESH2: 328493000,
	GATHER_THRESH3: 400000000,
	FILE_NUM_WIDTH: 9,
	XML_NUM_WIDTH: 3,
	HTTP_PORT: 80,
	HTTPS_PORT: 443,
	NODE_ENV: "dev",
	SAVED_FOLDER: "./_SAVED",
	CACHÉ_FOLDER: "./_CACHÉ",
	THEME_FOLDER: "./_THEMES",
	PREMADE_FOLDER: "./_PREMADE",
	EXAMPLE_FOLDER: "./_EXAMPLES"
};
Object.assign(process.env, env, require("./config"));

// app functions
app.use(require("./controllers"))
app.use(url)
app.all('/', (req, res) => {
	const p = url.parse(req.url, true);
	console.log(req.method, p.path, "-", res.statusCode);
	res.send('Hello, Anistick Studio Online is currently in beta. i know that its dead lol, but i just felt like trying something new.')
})
app.listen(process.env.PORT || 80)
