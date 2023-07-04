const app = require("../index");
const request = require("supertest");
const User = require("../models/User");
let access_token;
let test_user;

describe("POST /users/register", function () {
	it("Success register 201", async function () {
		const response = await request(app)
			.post("/users/register")
			.send({
				email: "suppatest@mail.com",
				password: "12345",
				username: "suppatest"
			})
			.set("Accept", "application/json");
		test_user = response.body;
		expect(response.status).toEqual(201);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).not.toHaveProperty("password");
		expect(response.body).toHaveProperty("premium", false);
		expect(response.body).toHaveProperty("subscriptionDeadline", null);
		expect(response.body).toHaveProperty("followerCount", 0);
		expect(response.body).toHaveProperty("followingCount", 0);
	});
	it("Fail unique email 400", async function () {
		const response = await request(app)
			.post("/users/register")
			.send({
				email: "suppatest@mail.com",
				password: "12345",
				username: "suppatest2"
			})
			.set("Accept", "application/json");
		expect(response.status).toEqual(400);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty(
			"message",
			"Email is already taken"
		);
	});
	it("Fail unique username 400", async function () {
		const response = await request(app)
			.post("/users/register")
			.send({
				email: "suppatest2@mail.com",
				password: "12345",
				username: "suppatest"
			})
			.set("Accept", "application/json");
		expect(response.status).toEqual(400);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty(
			"message",
			"Username is already taken"
		);
	});
	it("Fail empty email 400", async function () {
		const response = await request(app)
			.post("/users/register")
			.send({
				email: "",
				password: "12345",
				username: "suppatest"
			})
			.set("Accept", "application/json");
		expect(response.status).toEqual(400);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty("message", "Email is required");
	});
	it("Fail empty username 400", async function () {
		const response = await request(app)
			.post("/users/register")
			.send({
				email: "suppatest2@mail.com",
				password: "12345",
				username: ""
			})
			.set("Accept", "application/json");
		expect(response.status).toEqual(400);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty("message", "Username is required");
	});
	it("Fail empty password 400", async function () {
		const response = await request(app)
			.post("/users/register")
			.send({
				email: "suppatest2@mail.com",
				password: "",
				username: "suppatest"
			})
			.set("Accept", "application/json");
		expect(response.status).toEqual(400);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty("message", "Password is required");
	});
});
describe("POST /users/login", function () {
	it("Success login 200", async function () {
		const response = await request(app)
			.post("/users/login")
			.send({
				email: "suppatest@mail.com",
				password: "12345"
			})
			.set("Accept", "application/json");
		access_token = response.body.token;
		expect(response.status).toEqual(200);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty("token");
	});
	it("Fail invalid email 401", async function () {
		const response = await request(app)
			.post("/users/login")
			.send({
				email: "suppatest@mail.co",
				password: "12345"
			})
			.set("Accept", "application/json");
		expect(response.status).toEqual(401);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty(
			"message",
			"Invalid email / password"
		);
	});
	it("Fail invalid password 401", async function () {
		const response = await request(app)
			.post("/users/login")
			.send({
				email: "suppatest@mail.com",
				password: "1234"
			})
			.set("Accept", "application/json");
		expect(response.status).toEqual(401);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty(
			"message",
			"Invalid email / password"
		);
	});
});
describe("GET /users/:id", function () {
	it("Success fetch 200", async function () {
		const response = await request(app)
			.get(`/users/${test_user.id}`)
			.set("Accept", "application/json");
		expect(response.status).toEqual(200);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toEqual({
			id: expect.any(Number),
			username: expect.any(String),
			email: expect.any(String),
			followerCount: expect.any(Number),
			followingCount: expect.any(Number),
			premium: expect.any(Boolean),
			Session: expect.any(Array),
			ProfilePicture: expect.objectContaining({
				imageUrl: expect.any(String)
			})
		});
	});
	it("Fail user not found 404", async function () {
		const response = await request(app)
			.get("/users/100")
			.set("Accept", "application/json");
		expect(response.status).toEqual(404);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty(
			"message",
			"User with ID 100 not found"
		);
	});
	it("Fail invalid id 401", async function () {
		const response = await request(app)
			.get("/users/wrongInput")
			.set("Accept", "application/json");
		expect(response.status).toEqual(400);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty("message", "Invalid ID requested");
	});
});
describe("GET /pfps", function () {
	it("Success fetch 200", async function () {
		const response = await request(app)
			.get("/pfps")
			.set("Accept", "application/json");
		expect(response.status).toEqual(200);
		expect(response.body).toBeDefined();
		expect(Array.isArray(response.body)).toBe(true);
		response.body.forEach((item) => {
			expect(item).toEqual({
				id: expect.any(Number),
				imageUrl: expect.any(String)
			});
		});
	});
});
describe("GET /midtrans", function () {
	it("Success request 200", async function () {
		const response = await request(app)
			.get("/midtrans")
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(201);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toEqual({
			token: expect.any(String),
			redirect_url: expect.any(String)
		});
	});
	it("Success payment 200", async function () {
		const response = await request(app)
			.patch("/midtrans/success")
			.set("Accept", "application/json")
			.set("access_token", access_token);
		console.log(response.body);
		expect(response.status).toEqual(200);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty("message", "Subscription success");
	});
	it("Fail already subscribed 401", async function () {
		const response = await request(app)
			.get("/midtrans")
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(401);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty(
			"message",
			"You are already subscribed"
		);
	});
});
describe("GET /profile", function () {
	it("Success request 200", async function () {
		const response = await request(app)
			.get("/profile")
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(200);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toEqual({
			id: expect.any(Number),
			username: expect.any(String),
			email: expect.any(String),
			followerCount: expect.any(Number),
			followingCount: expect.any(Number),
			premium: expect.any(Boolean),
			Session: expect.any(Array),
			ProfilePicture: expect.objectContaining({
				imageUrl: expect.any(String)
			})
		});
	});
	it("Fail unauthenticated 401", async function () {
		const response = await request(app)
			.get("/profile")
			.set("Accept", "application/json")
			.set("access_token", "wrong_token");
		expect(response.status).toEqual(401);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty("message", "jwt malformed");
	});
});
describe("Follow endpoints", function () {
	it("Success POST /follow/:id 201", async function () {
		const response = await request(app)
			.post("/follow/1")
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(201);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toEqual({
			id: expect.any(Number),
			FollowedId: expect.any(Number),
			FollowerId: expect.any(Number)
		});
	});
	it("Fail POST /follow/:id 400", async function () {
		const response = await request(app)
			.post("/follow/1")
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(400);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty(
			"message",
			"You are already following this user"
		);
	});
	it("Success GET /follower 200", async function () {
		const response = await request(app)
			.get("/follower")
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(200);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Array);
		expect(response.body).toHaveLength(0);
	});
	it("Success GET /following 200", async function () {
		const response = await request(app)
			.get("/following")
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(200);
		expect(response.body).toBeDefined();
		expect(Array.isArray(response.body)).toBe(true);
		response.body.forEach((item) => {
			expect(item).toHaveProperty("Followed");
			expect(item.Followed).toHaveProperty("id");
			expect(typeof item.Followed.id).toBe("number");
			expect(item.Followed).toHaveProperty("username");
			expect(typeof item.Followed.username).toBe("string");
			expect(item.Followed).toHaveProperty("ProfilePicture");
			expect(item.Followed.ProfilePicture).toHaveProperty("imageUrl");
			expect(typeof item.Followed.ProfilePicture.imageUrl).toBe("string");
		});
	});
	it("Success DELETE /follow/:id 201", async function () {
		const response = await request(app)
			.delete("/follow/1")
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(201);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toEqual({
			id: expect.any(Number),
			FollowedId: expect.any(Number),
			FollowerId: expect.any(Number)
		});
	});
	it("Fail DELETE /follow/:id 404", async function () {
		const response = await request(app)
			.delete("/follow/100")
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(404);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty(
			"message",
			"Follow record not found"
		);
	});
	it("Fail POST /follow/:id 404", async function () {
		const response = await request(app)
			.post("/follow/100")
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(404);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty("message", "No User found");
	});
});

afterAll((done) => {
	User.delete(test_user.id)
		.then((_) => {
			done();
		})
		.catch((err) => {
			done(err);
		});
});
