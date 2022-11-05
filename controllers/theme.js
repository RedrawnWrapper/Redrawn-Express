const express = require("express"),
      router = express.Router(),
      http = require("http"),
      fUtil = require("../fileUtil"),
      folder = process.env.THEME_FOLDER,
      formidable = require("formidable")

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
router.post("/getThemeList/", (req, res) => {
  res.setHeader("Content-Type", "application/zip");
  fUtil.makeZip(`${folder}/themelist.xml`, "themelist.xml").then((b) => res.send(b));
})
router.post("/getTheme/", (req, res) => {
	new formidable.IncomingForm().parse(req, (e, f) => {
		res.setHeader("Content-Type", "application/zip");
		fUtil.makeZip(`${folder}/${f.themeId}.xml`, "theme.xml").then((b) => res.end(b));
	});
})
module.exports = router;
