const TOKEN_NAME = "jwtToken";

const logoutController = async (req, res) => {
	res.cookie(TOKEN_NAME, "");
	res.render("login.html", { error: false, message: "" });
	return;
};

module.exports = { logoutController };
