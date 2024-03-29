const express = require("express");
const cookieParser = require("cookie-parser");
const { renderLogin, loginController } = require("./controllers/login");
const { logoutController } = require("./controllers/logout");

const homeController = require("./controllers/home");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);

app.get("/", (req, res) => {
	let token = req.cookies["jwtToken"];
	if (!token) {
		res.redirect("/login");
		return;
	}
	homeController(req, res);
});

app.get("/login", (req, res) => {
	renderLogin(req, res);
});

app.post("/login", (req, res) => {
	loginController(req, res);
});

app.get("/logout", (req, res) => {
	logoutController(req, res);
});

// app.post("/500", (req, res) => {
// 	InternalError(req, res);
// });

app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, "views/error.html"));
});

app.listen(PORT, () => {
	console.log(`Running at: http://localhost:${PORT}`);
});
