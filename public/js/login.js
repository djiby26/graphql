const SIGNIN_URL = "https://learn.zone01dakar.sn/api/auth/signin";

const loginForm = document.querySelector(".login-form");
loginForm.addEventListener("submit", async (e) => {
	e.preventDefault();
	let formData = new FormData(loginForm);
	let fieldsValues = Object.fromEntries(formData);
	let emailUsername = fieldsValues["email-username"];
	let password = fieldsValues["password"];
	console.log(Object.fromEntries(formData));
	if (emailUsername != "" && password != "") {
		// login(emailUsername, password);
	}
});
