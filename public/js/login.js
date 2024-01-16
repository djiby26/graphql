const form = `
<form class="login-form">
<label for="email-username"> </label>
<input
    name="email-username"
    placeholder="enter your username or email"
    type="text"
/>
<label for="password"></label>
<input type="password" name="password" />
<button type="submit">Login</button>
</form>
`;

const SIGNIN_URL = "https://learn.zone01dakar.sn/api/auth/signin";

const loginForm = document.querySelector(".login-form");

async function login(usernameOrEmail, password) {
	let credentials = `${usernameOrEmail}:${password}`;
	let base64Credentials = btoa(credentials);
	let options = {
		method: "post",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Basic ${base64Credentials}`,
		},
	};

	let response = await fetch(SIGNIN_URL, options);
	setToLocalStorage("jwt-token", await response.json());
}

export function LoginView() {
	// const app = document.querySelector(".app");
	// app.innerHTML = form;
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();
		let formData = new FormData(loginForm);
		let fieldsValues = Object.fromEntries(formData);
		let emailUsername = fieldsValues["email-username"];
		let password = fieldsValues["password"];
		console.log(Object.fromEntries(formData));
		if (emailUsername != "" && password != "") {
			login(emailUsername, password);
		}
	});
}
