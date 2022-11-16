/* Looking for a written form of the themes list?
"action"
"akon"
"animal"
"anime"
"ben10"
"bizmodels"
"botdf"
"bunny"
"business"
"cc_store"
"chibi"
"chowder"
"christmas"
"common"
"commoncraft"
"custom"
"domo"
"fullenergy"
"infographics"
"monkeytalk"
"monstermsh"
"ninja"
"ninjaanime"
"politic"
"politics2"
"retro"
"sf"
"space"
"spacecitizen"
"startrek"
"stick"
"sticklybiz"
"street"
"underdog"
"vietnam"
"whiteboard"
"willie"
*/

const http = require("http");
const fUtil = require("../fileUtil");
const folder = process.env.THEME_FOLDER;

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "POST") return;
	switch (url.pathname) {
		case "/goapi/getThemeList/":
		case "/goapi/getThemeList/?": {
			res.setHeader("Content-Type", "application/zip");
			fUtil.makeZip(`${folder}/_themelist.xml`, "themelist.xml").then((b) => res.end(b));
			return true;
		}
	}
};
