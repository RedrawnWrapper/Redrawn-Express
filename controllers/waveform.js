const express = require("express"),
      router = express.Router(),
      formidable = require("formidable"),
      fs = require("fs"),
      get = require("../models/get")

router.post("/saveWaveForm/", (req, res) => {
	new formidable.IncomingForm().parse(req, (e, f) => {
		const id = f.wfid.slice(0, -4);
		fs.writeFileSync(process.env.ASSETS_FOLDER + `/${id}.wf`, f.waveform);
	});
})
router.post("/getWaveForm/", (req, res) => {
	new formidable.IncomingForm().parse(req, (e, f) => {
		console.log(f);
	});
})

module.exports = router;
