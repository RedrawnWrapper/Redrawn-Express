// vars
const express = require('express')
const app = express()
const url = require("url")
const fs = require("fs")

Object.assign(process.env, require("./env"), require("./config"));
const movie_thumb = require("./middlewares/movie_thumb");
const movie = require("./middlewares/movie");
const utilities = [movie_thumb, movie];

// app functions
app.use(require("./controllers"))
app.use(require("morgan")("dev"))
const stuff = require("./models/page");
app.use((req, res) => {
	const p = url.parse(req.url, true);
	utilities.find(f => f(req, res, p));
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

app.listen(process.env.PORT || 80, console.log("Anistick Has Started"))
