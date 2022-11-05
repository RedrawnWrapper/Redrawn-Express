const folder = process.env.SAVED_FOLDER,
      nodezip = require("node-zip"),
      fs = require("fs");

exports.padZero = function(n, l = process.env.FILE_NUM_WIDTH) {
	return ("" + n).padStart(l, "0");
};
exports.fillTemplate = function(temp, info) {
	return temp.replace(/%s/g, info);
};
exports.getNextFile = function(s, suf = ".xml", l = 7) {
	const regex = new RegExp(`${s}[0-9]*${suf}$`);
	const dir = fs.readdirSync(folder).filter((v) => v && regex.test(v));
	return `${folder}/${s}${this.padZero(dir.length, l)}${suf}`;
};
exports.getNextFileId = function(s, suf = ".xml", l = 7) {
	const indicies = this.getValidFileIndicies(s, suf, l);
	return indicies.length ? indicies[indicies.length - 1] + 1 : 0;
};
exports.fillNextFileId = function(s, suf = ".xml", data = Buffer.alloc(0), l = 7) {
	const id = this.getNextFileId(s, suf);
	const fn = this.getFileIndex(s, suf, id, l);
	fs.writeFileSync(fn, data);
	return id;
};
exports.getFileIndex = function(s, suf = ".xml", n, l = 7) {
	return this.getFileString(s, suf, this.padZero(n, l));
};
exports.getFileString = function(s, suf = ".xml", name) {
	return `${folder}/${s}${name}${suf}`;
};
exports.getValidFileIndicies = function(s, suf = ".xml", l = 7) {
	const regex = new RegExp(`${s}[0-9]{${l}}${suf}$`);
	return fs.readdirSync(folder).filter((v) => v && regex.test(v)).map((v) => Number.parseInt(v.substr(s.length, l)));
};
exports.getValidFileNames = function(s, suf = ".xml", l = 7) {
	const regex = new RegExp(`${s}[0-9]{${l}}${suf}$`);
	return fs.readdirSync(folder).filter((v) => v && regex.test(v)).map((v) => `${folder}/${v}`);
};
exports.getLastFileIndex = function(s, suf = ".xml", l = 7) {
	const regex = new RegExp(`${s}[0-9]{${l}}${suf}$`);
	const list = fs.readdirSync(folder).filter((v) => v && regex.test(v));
	return list.length ? Number.parseInt(list.pop().substr(s.length, l)) : -1;
};
exports.makeZip = function(fileName, zipName) {
	if (!fs.existsSync(fileName)) return Promise.reject();
	const buffer = fs.readFileSync(fileName);
	const zip = nodezip.create();
	this.addToZip(zip, zipName, buffer);
	return zip.zip();
};
exports.addToZip = function(zip, zipName, buffer) {
	zip.add(zipName, buffer);
	if (zip[zipName].crc32 < 0) zip[zipName].crc32 += 4294967296;
};
