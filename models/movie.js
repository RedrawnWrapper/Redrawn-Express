const caché = require("./caché"),
      fUtil = require("./file"),
      nodezip = require("node-zip"),
      parse = require("./parse"),
      fs = require("fs")

exports.save = function(movieZip, thumb, mId) {
	// Saves the thumbnail of the respective video.
	if (!mId) mId = `m-${fUtil.getNextFileId("movie-", ".xml")}`;
	var id = mId;
	if (thumb && id.startsWith("m-")) {
		const n = Number.parseInt(id.substr(2));
		const thumbFile = fUtil.getFileIndex("thumb-", ".png", n);
		fs.writeFileSync(thumbFile, thumb);
	}

	return new Promise(async (res, rej) => {
		caché.transfer(mId, id);
		var i = id.indexOf("-");
		var prefix = id.substr(0, i);
		var suffix = id.substr(i + 1);
		var zip = nodezip.unzip(movieZip);
		switch (prefix) {
			case "m": {
				var path = fUtil.getFileIndex("movie-", ".xml", suffix);
				var writeStream = fs.createWriteStream(path);
				var assetBuffers = caché.loadTable(id);
				parse.unpackMovie(zip, thumb, assetBuffers).then((data) => {
					writeStream.write(data, () => {
						writeStream.close();
						res(id);
					});
				});
				break;
			}
			default: rej("Error: Movie Saving Has Failed.");
		}
	});
};
exports.loadZip = function(mId) {
	return new Promise((res, rej) => {
		const i = mId.indexOf("-");
		const prefix = mId.substr(0, i);
		const suffix = mId.substr(i + 1);
		switch (prefix) {
			case "m": {
				let numId = Number.parseInt(suffix);
				if (isNaN(numId)) rej("Error: Movie ID Parsing Has Failed.");
				let filePath = fUtil.getFileIndex("movie-", ".xml", numId);
				if (!fs.existsSync(filePath)) rej("Error: Movie Not Found");

				const buffer = fs.readFileSync(filePath);
				if (!buffer || buffer.length == 0) rej("Error: Your Movie Has Failed To Load");

				parse.packMovie(buffer, mId).then((pack) => res(pack)).catch(e => rej(e))
				break;
			}
			case "s": {
				let numId = Number.parseInt(suffix);
				if (isNaN(numId)) rej("Error: Starter ID Parsing Has Failed.");
				let filePath = fUtil.getFileIndex("starter-", ".xml", numId);
				if (!fs.existsSync(filePath)) rej("Error: Starter Not Found");

				const buffer = fs.readFileSync(filePath);
				if (!buffer || buffer.length == 0) rej("Error: Your Starter Has Failed To Load");

				parse.packMovie(buffer, mId).then((pack) => res(pack)).catch(e => rej(e));
				break;
			}
			default: rej("Error: The function you are using cannot load a file outside of starters and movies. please change around some configurations and try again later.");
		}
	});
};
exports.loadXml = function(movieId) {
	return new Promise(async (res, rej) => {
		const i = movieId.indexOf("-");
		const prefix = movieId.substr(0, i);
		const suffix = movieId.substr(i + 1);
		if (prefix == "m") {
			const fn = fUtil.getFileIndex("movie-", ".xml", suffix);
			if (fs.existsSync(fn)) res(fs.readFileSync(fn));
			else rej("Error: Movie Not Found");
		}
	});
};
exports.loadThumb = function(movieId) {
	return new Promise(async (res, rej) => {
		if (!movieId.startsWith("m-")) return;
		const n = Number.parseInt(movieId.substr(2));
		const fn = fUtil.getFileIndex("thumb-", ".png", n);
		isNaN(n) ? rej() : res(fs.readFileSync(fn));
	});
};
exports.list = function() {
	const array = [];
	const last = fUtil.getLastFileIndex("movie-", ".xml");
	for (let c = last; c >= 0; c--) {
		const movie = fs.existsSync(fUtil.getFileIndex("movie-", ".xml", c));
		const thumb = fs.existsSync(fUtil.getFileIndex("thumb-", ".png", c));
		if (movie && thumb) array.push(`m-${c}`);
	}
	return array;
};
exports.meta = function(movieId) {
	return new Promise(async (res, rej) => {
		if (!movieId.startsWith("m-")) return;
		const n = Number.parseInt(movieId.substr(2));
		const fn = fUtil.getFileIndex("movie-", ".xml", n);

		const fd = fs.openSync(fn, "r");
		const buffer = Buffer.alloc(256);
		fs.readSync(fd, buffer, 0, 256, 0);
		const begTitle = buffer.indexOf("<title>") + 16;
		const endTitle = buffer.indexOf("]]></title>");
		const title = buffer.slice(begTitle, endTitle).toString().trim();

		const begDuration = buffer.indexOf('duration="') + 10;
		const endDuration = buffer.indexOf('"', begDuration);
		const duration = Number.parseFloat(buffer.slice(begDuration, endDuration));
		const min = ("" + ~~(duration / 60)).padStart(2, "0");
		const sec = ("" + ~~(duration % 60)).padStart(2, "0");
		const durationStr = `${min}:${sec}`;

		fs.closeSync(fd);
		res({
			date: fs.statSync(fn).mtime,
			durationString: durationStr,
			duration: duration,
			title: title || "Untitled Video",
			id: movieId,
		});
	});
};
