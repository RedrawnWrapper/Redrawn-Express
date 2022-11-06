const thumbUrl = process.env.THUMB_BASE_URL;
const get = require("../models/get");
const http = require("http");
const asset = require("../models/asset");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	var path = url.pathname;
	if (req.method != "GET") return; 
	switch (path) {
		case "/stock_thumbs": {
			get(thumbUrl + path.substr(path.lastIndexOf("/"))).then((v) => res.end(v)).catch(e => console.log(e));
			return true;
		}
	}
	const match = req.url.match(/\/assets\/([^/]+)\/([^/]+)$/);
	if (!match) return;
	const type = match[1];
	const aId = match[2];
	const dot = aId.lastIndexOf(".");
	const ext = aId.substr(dot + 1);
	asset.loadOnGetRequest(type, aId, ext).then(b => res.end(b)).catch(e => { console.log(e), res.end(`<center><h1>${e || "404 Not Found"}</h1></center>`) });
	return true;
};
