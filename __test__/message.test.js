const app = require("../index");
const request = require("supertest");
const access_token =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJEaWRpdEBtYWlsLmNvbSIsImlhdCI6MTY4ODQ2MTE2MH0.LItzsxJk8YEUtmjkz1TkzwdA_7W41YYWG5Gsj0aZl1g";

describe("POST /sendMessage", function () {
	it("Success post 201", async function () {
		const response = await request(app)
			.post("/sendMessage")
			.send({
				receiverId: "1",
				message: "Jest test"
			})
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty(
			"message",
			"Message sent successfully."
		);
	});
	it("Fail self post 400", async function () {
		const response = await request(app)
			.post("/sendMessage")
			.send({
				receiverId: "6",
				message: "Jest test"
			})
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(400);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty(
			"message",
			"Can not send message to self"
		);
	});
	it("Fail not found 404", async function () {
		const response = await request(app)
			.post("/sendMessage")
			.send({
				receiverId: "600",
				message: "Jest test"
			})
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(404);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty(
			"message",
			"User with ID 600 not found"
		);
	});
});
describe("GET /inbox", function () {
	it("Success fetch 200", async function () {
		const response = await request(app)
			.get("/inbox")
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(200);
		expect(response.body).toBeDefined();
		expect(typeof response.body.messages).toBe("object");

		for (let messageId in response.body.messages) {
			expect(response.body.messages[messageId]).toEqual({
				asSender: expect.any(Boolean),
				message: expect.any(String),
				receiverId: expect.any(Number),
				senderId: expect.any(Number),
				time: expect.any(Number)
			});
		}
	});
});
describe("GET /chat/:id", function () {
	it("Success fetch 200", async function () {
		const response = await request(app)
			.get("/chat/1")
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(200);
		expect(response.body).toBeDefined();
		expect(typeof response.body.messages).toBe("object");
		for (let messageId in response.body.messages) {
			expect(response.body.messages[messageId]).toEqual({
				asSender: expect.any(Boolean),
				message: expect.any(String),
				receiverId: expect.any(Number),
				senderId: expect.any(Number),
				time: expect.any(Number)
			});
		}
	});
	it("Fail not found 404", async function () {
		const response = await request(app)
			.get("/chat/100")
			.set("Accept", "application/json")
			.set("access_token", access_token);
		expect(response.status).toEqual(404);
		expect(response.body).toBeDefined();
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty(
			"message",
			"User with ID 100 not found"
		);
	});
});
