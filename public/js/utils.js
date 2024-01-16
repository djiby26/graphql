const API_ENDPOINT = `https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql`;

let bearerToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyMDQ3IiwiaWF0IjoxNzA1MTkxNjMyLCJpcCI6IjQxLjgyLjE4Mi43MCwgMTcyLjE4LjAuMiIsImV4cCI6MTcwNTI3ODAzMiwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtY2FtcHVzZXMiOiJ7fSIsIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS11c2VyLWlkIjoiMjA0NyIsIngtaGFzdXJhLXRva2VuLWlkIjoiMzRjNGNiNmUtZGY0Yi00MTZhLTgwOGYtZGE0NzhmYjc4OTg1In19.l1_lBxbocR_Y2T9nZUD76uSq6mIolRW1IXzvkGAiwsc`;

export function setSessionStorage(key, value) {
	sessionStorage.setItem(key, value);
}

export function getFromSessionStorage(key) {
	return sessionStorage.getItem(key);
}

export async function getHomeData() {
	const token = getFromSessionStorage("jwt_token");
	if (!token) {
		// navigateTo("/login")
		// return;
	}

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
			// authorization: token ? `Bearer ${token}` : "",
		},
		body: JSON.stringify({ query: graphqlQuery }),
	};

	try {
		let response = await fetch(API_ENDPOINT, request);
		let data = await response.json();
		console.log("response:", data);
	} catch (error) {
		console.log("error:", error);
	}
}
