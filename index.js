// vars
const express = require('express')
const app = express()
const url = require("url")
const fs = require("fs")

Object.assign(process.env, require("./env"), require("./config"));

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
// logs
app.all('/', (req, res) => {
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
app.listen(process.env.PORT || 80)
