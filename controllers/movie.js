const express = require("express"),
      router = express.Router(),
      base = Buffer.alloc(1, 0),
      movie = require("../models/movie"),
      http = require("http"),
      get = require("../models/get"),
      formidable = require("formidable"),
      loadPost = require("../models/body"),
      starter = require("../models/starter"),
      url = require("url")

router.get("/movieList", (req, res) => Promise.all(movie.list().map(movie.meta)).then((a) => res.end(JSON.stringify(a))));
router.get("/meta", (req, res) => {
	const p = url.parse(req.url, true);
	movie.meta(p.path.substr(p.path.lastIndexOf("/") + 1)).then((v) => res.end(JSON.stringify(v))).catch(e => {
		res.statusCode = 404;
		console.log(e);
		res.end(e);
	});
})
router.get(/\/movie_thumbs\/([^/]+)$/, (req, res) => {
	const file = req.matches[1];
	movie.loadThumb(file).then((v) => {
		res.setHeader("Content-Type", "image/png");
		res.statusCode = 200;
		res.end(v);
	}).catch(e => {
		res.statusCode = 400;
		console.log(e);
		res.end(e);
	});
})
router.get(/\/movies\/([^.]+)(?:\.(zip|xml))?$/, (req, res) => {
	var id = req.matches[1];
	var ext = req.matches[2];
	switch (ext) {
		case "zip":
			res.setHeader("Content-Type", "application/zip");
			movie.loadZip(id).then((v) => {
				if (v) {
					res.statusCode = 200;
					res.end(v);
				} else {
					res.statusCode = 404;
					res.end();
				}
			});
			break;
		default:
			res.setHeader("Content-Type", "text/xml");
			movie.loadXml(id).then((v) => {
				if (v) {
					res.statusCode = 200;
					res.end(v);
				} else {
					res.statusCode = 404;
					res.end();
				}
			});
			break;
	}
})
router.post("/upload_movie", (req, res) => {
	new formidable.IncomingForm().parse(req, (e, f, files) => {
		if (!files.import) return;
		var path = files.import.path;
		var buffer = fs.readFileSync(path);
		var numId = fUtil.getNextFileId("movie-", ".xml");
		parse.unpackXml(buffer, `m-${numId}`);
		fs.unlinkSync(path);

		res.statusCode = 302;
		var url = `/go_full?movieId=m-${numId}`;
		res.setHeader("Location", url);
		res.end();
	});
})
router.post("/getMovie/", (req, res) => { 
	const p = url.parse(req.url, true);
	res.setHeader("Content-Type", "application/zip");
	movie.loadZip(p.query.movieId).then((b) => res.end(Buffer.concat([base, b]))).catch(e => { console.log(e), res.end("1" + e) });
})
router.post("/saveMovie/", (req, res) => {
	get(process.env.THUMB_BASE_URL + '/274502704.jpg').then(t => {
		const body = Buffer.from(req.body.body_zip, "base64"),
		      thumb = !req.body.thumbnail ? t : Buffer.from(req.body.thumbnail, "base64")
		movie.save(body, thumb, req.body.movieId).then(id => res.end(0 + id)).catch(e => console.log(e));
	}).catch(e => console.log(e));
})
router.post("/saveTemplate/", (req, res) => {
	loadPost(req, res).then(data => {
		const body = Buffer.from(data.body_zip, "base64"),
		      thumb = Buffer.from(data.thumbnail, "base64")
		starter.save(body, thumb, data.movieId).then(id => res.end(0 + id)).catch(e => console.log(e));
	});
})

module.exports = router;
