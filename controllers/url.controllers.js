const { nanoid } = require("nanoid");
const URL = require("../models/url.models");

async function handleGenerateNewShortURL(req, res) {
	try {
		const { url } = req.body;
		console.log(url);

		if (!url || typeof url !== "string") {
			return res.status(400).json({ error: "Valid url is required " });
		}

		const shortID = nanoid(10);

		await URL.create({
			shortId: shortID,
			redirectURL: url,
			visitHistory: [],
            createdBy: req.user._id
		});

		return res.render("home", {
			id: shortID,
		});
	} catch (error) {
		console.error("Error creating short URL:", error);
	}
}

async function handleGetAnalytics(req, res) {
	const shortId = req.params.shortId;
	const result = await URL.findOne({ shortId });
	return res.json({
		totalClicks: result.visitHistory.length,
		analytics: result.visitHistory,
	});
}

module.exports = {
	handleGenerateNewShortURL,
	handleGetAnalytics,
};
