const app = require("../index");
const request = require("supertest");
const Arcade = require("../models/Arcade");
const access_token =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJtYXN0ZXJAbWFpbC5jb20iLCJpYXQiOjE2ODg0ODg0MjB9.m_nxqcDmXW87nigXmzI82is1OayhDn3PyXqQTaToFuI";
let test_arcade;
const lat = -6.3053252;
const lng = 106.6435346;

describe("GET /arcades", function () {
	it("Success get arcades 200", async function () {
		const response = await request(app)
			.get("/arcades")
			.set("Accept", "application/json");
		expect(Array.isArray(response.body)).toBe(true);
		expect(response.status).toEqual(200);
		expect(response.body).toBeDefined();
		response.body.forEach((item) => {
			expect(item).toEqual({
				id: expect.any(Number),
				name: expect.any(String),
				lat: expect.any(Number),
				lng: expect.any(Number),
				rating: expect.any(Number),
				ratingCount: expect.any(Number),
				BrandId: expect.any(Number),
				Brand: expect.any(Object)
			});
		});
	});
	it("Success get arcades with distance 200", async function () {
		const response = await request(app)
			.get(`/arcades?lat=${lat}&lng=${lng}`)
			.set("Accept", "application/json");
		expect(Array.isArray(response.body)).toBe(true);
		expect(response.status).toEqual(200);
		expect(response.body).toBeDefined();
		response.body.forEach((item) => {
			expect(item).toEqual({
				id: expect.any(Number),
				name: expect.any(String),
				lat: expect.any(Number),
				lng: expect.any(Number),
				rating: expect.any(Number),
				ratingCount: expect.any(Number),
				BrandId: expect.any(Number),
				Brand: expect.any(Object),
				distance: expect.any(Number)
			});
		});
	});
});
describe("GET /main", function () {
	it("Success fetch 200", async function () {
		const response = await request(app)
			.get(`/main?lat=${lat}&lng=${lng}`)
			.set("Accept", "application/json");
		expect(Array.isArray(response.body)).toBe(true);
		expect(response.status).toEqual(200);
		expect(response.body).toBeDefined();
		response.body.forEach((item) => {
			expect(item).toEqual({
				id: expect.any(Number),
				name: expect.any(String),
				lat: expect.any(Number),
				lng: expect.any(Number),
				rating: expect.any(Number),
				ratingCount: expect.any(Number),
				BrandId: expect.any(Number),
				Brand: expect.any(Object),
				distance: expect.any(Number)
			});
		});
	});
});

describe("GET /detail/:id", function () {
	it("Success GET Arcades base on id", async function () {
		const response = await request(app)
			.get("/detail/1")
			.set("Accept", "application/json");
		expect(response.status).toEqual(200);
		expect(response.body).toBeDefined();
		expect(response.body).toHaveProperty("name");
		expect(response.body).toHaveProperty("lat");
		expect(response.body).toHaveProperty("lng");
		expect(response.body).toHaveProperty("rating");
	});

	it("Failed GET Arcades base on id", async function () {
		const response = await request(app)
			.get("/detail/100")
			.set("Accept", "application/json");
		expect(response.status).toEqual(404);
		expect(typeof response.body).toBe("object");
		expect(response.body).toHaveProperty("message");
	});
});

describe("POST /arcades", function () {
	it("Success POST arcades 201", async function () {
		const response = await request(app)
			.post("/arcades")
			.send({
				name: "Test",
				lat: -6.1572666,
				lng: 106.9084263,
				BrandId: 1,
				games: [
					{
						id: 2
					}
				]
			})
			.set("Accept", "application/json");
		test_arcade = response.body;
		expect(response.status).toEqual(201);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty("id");
	});

	it("Failed POST arcades 400", async function () {
		const response = await request(app)
			.post("/arcades")
			.send({
				name: "",
				lat: -6.1572666,
				lng: 106.9084263,
				BrandId: 1,
				games: [
					{
						id: 2
					}
				]
			})
			.set("Accept", "application/json");
		expect(response.status).toEqual(400);
		expect(typeof response.body).toBe("object");
		expect(response.body).toHaveProperty("message");
	});
});

describe("Rate", function () {
	it("Fail invalid rate", async function () {
		const response = await request(app)
			.post(`/rate/${test_arcade.id}`)
			.set("Accept", "application/json")
			.send({
				rating: 400
			})
			.set("access_token", access_token);
		expect(response.status).toEqual(400);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty(
			"message",
			"Rating must be between 0 to 5"
		);
	});
	it("Success POST /rate/:id", async function () {
		const response = await request(app)
			.post(`/rate/${test_arcade.id}`)
			.set("Accept", "application/json")
			.send({
				rating: 4
			})
			.set("access_token", access_token);
		expect(response.status).toEqual(201);
		expect(response.body).toBeDefined();
		expect(response.body).toHaveProperty("name");
		expect(response.body).toHaveProperty("lat");
		expect(response.body).toHaveProperty("lng");
		expect(response.body).toHaveProperty("rating", 4);
		expect(response.body).toHaveProperty("ratingCount", 1);
	});
	it("Fail duplicate rate", async function () {
		const response = await request(app)
			.post(`/rate/${test_arcade.id}`)
			.set("Accept", "application/json")
			.send({
				rating: 4
			})
			.set("access_token", access_token);
		expect(response.status).toEqual(400);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty(
			"message",
			"You have already rated this arcade"
		);
	});
	it("Fail not found 404", async function () {
		const response = await request(app)
			.post(`/rate/500`)
			.set("Accept", "application/json")
			.send({
				rating: 4
			})
			.set("access_token", access_token);
		expect(response.status).toEqual(404);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty("message", "No Arcade found");
	});
});

describe("report", function () {
	it("Success report 200", async function () {
		const response = await request(app)
			.post(`/report/23`)
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(201);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toEqual({
			id: expect.any(Number),
			reportCount: expect.any(Number),
			ArcadeId: expect.any(Number),
			GameId: expect.any(Number)
		});
	});
	it("Fail duplicate 400", async function () {
		const response = await request(app)
			.post(`/report/23`)
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(400);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty(
			"message",
			"You have already reported this arcade game"
		);
	});
	it("Fail not found 404", async function () {
		const response = await request(app)
			.post(`/report/200`)
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(404);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty("message", "No ArcadeGame found");
	});
});

describe("POST /session/add/:id", function () {
	it("Success POST session 201", async function () {
		const response = await request(app)
			.post(`/session/add/${test_arcade.id}`)
			.send({
				date: "2023-07-08"
			})
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(201);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty("id");
	});
	it("Faile duplicate 400", async function () {
		const response = await request(app)
			.post(`/session/add/${test_arcade.id}`)
			.send({
				date: "2023-07-08"
			})
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(400);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty("message");
	});

	it("Failed POST session 400", async function () {
		const response = await request(app)
			.post(`/session/add/${test_arcade.id}`)
			.send({
				date: "2023-07-03"
			})
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(400);
		expect(response.body).toHaveProperty("message");
		expect(response.body).toBeInstanceOf(Object);
	});
});

afterAll(async () => {
	try {
		await Arcade.deleteArcade(+test_arcade.id);
	} catch (error) {
		console.log(error);
		throw error;
	}
});
