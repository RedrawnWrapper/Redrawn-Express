const fUtil = require("../models/file");
const folder = process.env.THEME_FOLDER;

module.exports = function(req, res, url) {
  if (req.method == "POST" && url.pathname == "/goapi/getThemeList/?") return;
  res.setHeader("Content-Type", "application/zip");
  fUtil.makeZip(`${folder}/_themelist.xml`, "themelist.xml").then((b) => res.send(b)).catch(e => console.log(e));
  return true;
}
