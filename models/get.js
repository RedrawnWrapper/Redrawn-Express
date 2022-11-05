const https = require("https"),
      http = require("https")
/**
 * @param {import("url").UrlWithParsedQuery} url
 * @param {CredentialRequestOptions} [options]
 * @returns {Promise<Buffer>}
 */
module.exports = function (url, options = {}) {
	var data = [];
	return new Promise((res, rej) => {
		try {
			try {
				https.get(url, options, (o) => o.on("data", (v) => data.push(v)).on("end", () => res(Buffer.concat(data))).on("error", rej("Error: https get request failed. Please contact support and try again later.")));
			} catch (e) {
				rej("Error: https get request failed. trying http...");
				http.get(url, options, (o) => o.on("data", (v) => data.push(v)).on("end", () => res(Buffer.concat(data))).on("error", rej("Error: https get request failed. Please contact support and try again later.")));
			}
		} catch (e) {
			rej("Error: All Get Requests Failed.", e);
		}
	});
};
