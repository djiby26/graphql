const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "views/index.html"), (err) => {
		if (err) {
			res.writeHead(404, "Page Not found");
		}
	});
});

app.get("/login", (req, res) => {
	res.sendFile(path.join(__dirname, "views/login.html"), (err) => {
		if (err) {
			res.writeHead(404, "Page Not found");
			return;
		}
	});
});

app.get("/404", (req, res, next) => {
	res.send("<h1>Page not found!</h1>");
});

app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, "views/errors.html"));
});

app.listen(PORT, () => {
	console.log(`Running at: http://localhost:${PORT}`);
});
