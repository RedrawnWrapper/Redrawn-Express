// vars
const express = require('express')
const app = express()
const url = require("url")
const fs = require("fs")

// env stuff
const env = {
	CHAR_BASE_URL: "https://raw.githubusercontent.com/Anistick/anichars/master/characters",
	THUMB_BASE_URL: "https://raw.githubusercontent.com/Anistick/anithumbs/master/thumbnails",
	XML_HEADER: "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n",
	CROSSDOMAIN: "<cross-domain-policy><allow-access-from domain=\"*\"/></cross-domain-policy>",
	META_FOLDER: "./files/assets/meta",
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
	SAVED_FOLDER: "./files/saved",
	CACHÉ_FOLDER: "./files/cache",
	THEME_FOLDER: "./files/themes"
};
Object.assign(process.env, env, require("./config"));

// app functions
app.use(require("./controllers"))
const stuff = require("./models/page");
app.use((req, res) => {
	const p = url.parse(req.url, true);
	var methodLinks = stuff[req.method];
	for (let linkIndex in methodLinks) {
		var regex = new RegExp(linkIndex);
		if (regex.test(p.path)) {
			var t = methodLinks[linkIndex];
			var link = t.regexLink ? p.path.replace(regex, t.regexLink) : t.link || p.path;
			var headers = t.headers;
			var path = `./${link}`;

			try {
				for (var headerName in headers || {}) {
					res.setHeader(headerName, headers[headerName]);
				}
				res.statusCode = t.statusCode || 200;
				if (t.content !== undefined) res.end(t.content);
				else if (fs.existsSync(path)) {
					if (t.contentReplace) {
						content = fs.readFileSync(path, "utf8");
						content = content.replace(/VERSIÖN/g, pjson.versionStr);
						res.end(content);
					} else fs.createReadStream(path).pipe(res);
				} else throw null;
			} catch (e) {
				res.statusCode = t.statusCode || 404;
				res.end();
			}
		}
	}
})
app.listen(process.env.PORT || 80)
