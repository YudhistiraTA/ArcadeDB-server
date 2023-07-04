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

afterAll((done) => {
	User.delete(test_user.id)
		.then((_) => {
			done();
		})
		.catch((err) => {
			done(err);
		});
});
