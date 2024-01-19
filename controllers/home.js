const API_ENDPOINT = `https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql`;

module.exports = (req, res) => {
	let jwtToken = req.cookies["jwtToken"];
	getHomeData(jwtToken, res);
};

async function getHomeData(bearerToken, res) {
	// const graphqlQuery = `
	// 	query {
	// 		user {
	// 			id
	// 			login
	// 			firstName
	// 			lastName
	// 			auditRatio
	// 			email
	// 		}
	// 	}
	// `;

	const graphqlQuery = `
	query User {
		user {
			auditRatio
			campus
			email
			firstName
			id
			lastName
			login
			profile
			totalDown
			totalUp
			updatedAt
			audits(
				where: {
					group: {
						status: { _neq: finished }
						captain: { isAvailable: { _eq: true } }
					}
				}
			) {
				group {
					captainLogin
					status
				}
				private {
					code
				}
			}
		}
		transaction(
			order_by: [{ type: desc }, { amount: desc }]
			distinct_on: [type]
			where: { type: { _like: "skill_%" } }
		) {
			amount
			type
		}
		event(
			where: {
				usersRelation: { userId: { _eq: 2047 } }
				object: { type: { _in: ["module", "piscine"] } }
			}
		) {
			id
			path
			endAt
			createdAt
			parent {
				id
				path
				registrationId
			}
			pathByPath {
				path_archives {
					status
				}
			}
			registration {
				id
				attrs
				endAt
				startAt
			}
			usersRelation(where: { userId: { _eq: 2047 } }) {
				createdAt
			}
		}
		transaction_aggregate(
			where: { type: { _eq: "xp" }, eventId: { _eq: 56 } }
		) {
	aggregate {
				sum {
					amount
				}
			}
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
