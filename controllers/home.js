const { response } = require("express");

const API_ENDPOINT = `https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql`;

module.exports = (req, res) => {
	let jwtToken = req.cookies["jwtToken"];
	getHomeData(jwtToken, res);
};

async function getHomeData(bearerToken, res) {
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
					object {
						name
					}
				}
				private {
					code
				}
			}
			transactions(
				where: { type: {_like:"skill_%"} }
				distinct_on:[type]
				order_by: [{ type: desc }, { amount: desc }]) {
				amount
				type
		
			}
		   finished_project: groups_aggregate(
				where: {
					group: { object: { type: { _eq: "project" } }, status: { _eq: finished } }
				}
			) {
				aggregate {
					count
				}
			}
	
			 progresses(
				where: { object: { type: { _eq: "project" } }, isDone: { _eq: false } }
				order_by: {createdAt: desc}
				limit:1
			) {
				grade
				isDone
				userLogin
				object {
					name
					type
				}
			}
		}
	
		piscine_go: transaction_aggregate(
			where: { type: { _eq: "xp" }, eventId: { _eq: 23 } }
		) {
			aggregate {
				sum {
					amount
				}
			}
		}
		piscine_js: transaction_aggregate(
			where: { type: { _eq: "xp" }, eventId: { _eq: 95 } }
		) {
			aggregate {
				sum {
					amount
				}
			}
		}
		div_01: transaction_aggregate(
			where: { type: { _eq: "xp" }, eventId: { _eq: 56 } }
		) {
			aggregate {
				sum {
					amount
				}
			}
		}
		audit_pass_fail_count : user {
			fail: 
				audits_aggregate(
					where: { grade: { _is_null: false }, _and: { grade: { _lt: 1 } } }) {
				aggregate{
					count
				}
			}
			pass: 
				audits_aggregate(
					where: { grade: { _is_null: false }, _and: { grade: { _gte: 1 } } }) {
				aggregate{
					count
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

async function handleApiResponse(apiResponse, httpResponse) {
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
		const userInfos = apiResponse.data.user[0];
		const progress = userInfos.progresses[0];
		let currentProject = progress ? progress.object.name : "no project";
		let finishedProjectCount = userInfos.finished_project.aggregate.count;
		let div_01_xp = Math.round(
			apiResponse.data.div_01.aggregate.sum.amount / 1000
		);
		let piscine_go_xp = Math.round(
			apiResponse.data.piscine_go.aggregate.sum.amount / 1000
		);

		let piscine_js_xp = Math.round(
			apiResponse.data.piscine_js.aggregate.sum.amount / 1000
		);

		let auditPassFailCount = apiResponse.data.audit_pass_fail_count[0];
		let auditPassCount = auditPassFailCount
			? auditPassFailCount.pass.aggregate.count
			: 0;
		let auditFailCount = auditPassFailCount
			? auditPassFailCount.fail.aggregate.count
			: 0;

		let skills = [];
		let skillsTransactions = [...userInfos.transactions];
		if (skillsTransactions.length > 0) {
			skills = skillsTransactions.map((e) => {
				e.type = e.type.split("_")[1];
				return e;
			});
		}

		let passFailData = [
			{
				name: "pass",
				color: "red",
				value: auditPassCount,
			},
			{
				name: "fail",
				color: "rebeccapurple",
				value: auditFailCount,
			},
		];
		let totalValue = 0;
		for (var i = 0; i < passFailData.length; i++) {
			totalValue += passFailData[i].value;
		}

		// Handle a successful response
		httpResponse.render("index.html", {
			...userInfos,
			currentProject,
			div_01_xp,
			piscine_go_xp,
			piscine_js_xp,
			finishedProjectCount,
			auditPassCount,
			auditFailCount,
			skills,
			passFailData,
			totalValue,
		});

		// console.log(progress);
		console.log("successfull login");
	}
}
