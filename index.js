const express = require("express");
const { connectToMongoDB } = require("./connection");
const URL = require("./models/url.models");
const urlRoutes = require("./routes/url.routes");
const staticRoute = require("./routes/staticRouter.routes");
const userRoute = require("./routes/user.routes");
const {
	restrictToLoggedinUserOnly,
	checkAuth,
} = require("./middlewares/auth.middleware");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = 3001;

connectToMongoDB(
	"mongodb+srv://lanetpc5:MGLW935Rvtmq9JxE@first-cluster.lx95tlj.mongodb.net/short-urls"
).then(() => console.log("mongodb connected ....."));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use("/url", restrictToLoggedinUserOnly, urlRoutes);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.get("/test", async (req, res) => {
	const allurls = await URL.find({});
	return res.render("home", {
		urls: allurls,
	});
});

app.get("/:nanoId", async (req, res) => {
	const nanoId = req.params.nanoId;
	const entry = await URL.findOneAndUpdate(
		{
			shortId: nanoId,
		},
		{
			$push: {
				visitHistory: {
					timeStamp: Date.now(),
				},
			},
		}
	);
	if (!entry) {
		return res.status(404).send("Short URL not found");
	}

	return res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
