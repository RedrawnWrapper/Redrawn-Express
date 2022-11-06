const express = require("express"),
      router = express.Router(),
      movie = require("./main"),
      http = require("http"),
      get = require("../request/get"),
      formidable = require("formidable")
router.post("/saveMovie/", (req, res) => {
  new formidable.IncomingForm().parse(req, (e, f) => {
    get(process.env.THUMB_BASE_URL + '/274502704.jpg').then(t => {
			const body = Buffer.from(data.body_zip, "base64"),
			thumb = !data.thumbnail ? t : Buffer.from(data.thumbnail, "base64");
			movie.save(body, thumb, data.presaveId).then(id => res.end(0 + id)).catch(e => console.log(e));
		}).catch(e => console.log(e));
  });
})
