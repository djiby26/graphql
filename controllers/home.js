const API_ENDPOINT = `https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql`;

module.exports = (req, res) => {
	let jwtToken = req.cookies["jwtToken"];
	getHomeData(jwtToken, res);
};

async function getHomeData(bearerToken, res) {
	const graphqlQuery = `
		query {
			user {
				id
				login
				firstName
				lastName
				auditRatio
				email
			}	
		}
	`;

	const request = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${bearerToken}`,
		},
		body: JSON.stringify({ query: graphqlQuery }),
	};

	try {
		let response = await fetch(API_ENDPOINT, request);
		let data = await response.json();
		handleApiResponse(data, res);
	} catch (error) {
		console.log("error:", error);
	}
}

function handleApiResponse(apiResponse, httpResponse) {
	if (apiResponse.errors && apiResponse.errors.length > 0) {
		const error = apiResponse.errors[0];
		if (error.extensions && error.extensions.code === "invalid-jwt") {
			if (error.message.includes("JSONDecodeError")) {
				console.log("not a valid base64url or decoding errors");
			} else if (error.message === "Could not verify JWT: JWTExpired") {
				console.log("Token has expired");
			}
			httpResponse.redirect("/login");
			return;
		}
	} else {
		// Handle a successful response
		httpResponse.render("index.html");
		console.log("successfull login");
	}
}
