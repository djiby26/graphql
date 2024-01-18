const SIGNIN_URL = "https://learn.zone01dakar.sn/api/auth/signin";
const TOKEN_NAME = "jwtToken";

const renderLogin = (req, res) => {
	res.render("login.html", { error: false, message: "" });
};

const loginController = async (req, res) => {
	let { emailOrUsername = "", password = "" } = req.body;
	emailOrUsername = emailOrUsername.trim();
	password = password.trim();
	if (emailOrUsername != "" && password != "") {
		let response = await signin(emailOrUsername, password);
		let status = response.status;
		let jsonResponse = await response.json();
		if (status != 200 && status != 500) {
			res.render("login.html", { error: true, message: jsonResponse.error });
			return;
		} else if (status == 500) {
			res.render("error.html", {
				error: true,
				message: "a problem has occured",
			});
			return;
		}
		let jwtToken = jsonResponse;
		res.cookie(TOKEN_NAME, jwtToken, { httpOnly: true });
		res.redirect("/");
	} else {
		res.render("login.html", { error: true, message: "Inputs can't be empty" });
	}
};

async function signin(emailOrUsername, password) {
	let credentials = `${emailOrUsername}:${password}`;
	let base64Credentials = btoa(credentials);
	let options = {
		method: "post",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Basic ${base64Credentials}`,
		},
	};
	return await fetch(SIGNIN_URL, options);
}

module.exports = { renderLogin, loginController };
