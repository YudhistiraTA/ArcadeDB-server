const app = require("../index");
const request = require("supertest");
const User = require("../models/User");
const access_token =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJEaWRpdEBtYWlsLmNvbSIsImlhdCI6MTY4ODQ2MTE2MH0.LItzsxJk8YEUtmjkz1TkzwdA_7W41YYWG5Gsj0aZl1g";

describe("POST /bookmarks/:id", function () {
	it("Success post 201", async function () {
		const response = await request(app)
			.post("/bookmarks/1")
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(201);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toEqual({
			id: expect.any(Number),
			UserId: 6,
			ArcadeId: 1
		});
	});
	it("Fail not found 404", async function () {
		const response = await request(app)
			.post("/bookmarks/400")
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(404);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty("message", "Arcade not found");
	});
	it("Fail already bookmarked 400", async function () {
		const response = await request(app)
			.post("/bookmarks/1")
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(400);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty(
			"message",
			"Arcade has already been bookmarked"
		);
	});
});
describe("GET /bookmarks", function () {
	it("Success fetch 200", async function () {
		const response = await request(app)
			.get("/bookmarks")
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(200);
		expect(response.body).toBeDefined();
		expect(response.body).toHaveProperty("Bookmark");
		expect(Array.isArray(response.body.Bookmark)).toBe(true);
		response.body.Bookmark.forEach((item) => {
			expect(item).toHaveProperty("Arcade");
			expect(item.Arcade).toEqual({
				id: expect.any(Number),
				name: expect.any(String),
				lat: expect.any(Number),
				lng: expect.any(Number),
				rating: expect.any(Number),
				ratingCount: expect.any(Number),
				BrandId: expect.any(Number)
			});
		});
	});
});
describe("DELETE /bookmarks/:id", function () {
	it("Success delete 200", async function () {
		const response = await request(app)
			.delete("/bookmarks/1")
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(200);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toEqual({
			count: 1
		});
	});
	it("Fail not found 404", async function () {
		const response = await request(app)
			.delete("/bookmarks/1")
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(404);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty(
			"message",
			"Bookmark record not found"
		);
	});
});
