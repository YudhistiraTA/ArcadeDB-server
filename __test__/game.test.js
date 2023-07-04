const app = require("../index");
const request = require("supertest");
const access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJtYXN0ZXJAbWFpbC5jb20iLCJpYXQiOjE2ODg0ODQ3MzN9.iDFxdeRkfp6630pw9EEiOHMO_xdoRfyCW4O-rVU7MhM";

describe("GET  /games", function () {
  it("Success get games 200", async function () {
    const response = await request(app)
      .get("/games")
      .set("Accept", "application/json");
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
    response.body.forEach((item) => {
      expect(item).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        logoUrl: expect.any(String),
      });
    });
  });
});

describe("GET /games/1", function () {
  it("Success fetch based on location 200", async function () {
    const response = await request(app)
      .get("/games/1")
      .set("Accept", "application/json")
      .set("access_token", access_token);
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      logoUrl: expect.any(String),
      ArcadeGame: expect.any(Array),
    });
    response.body.ArcadeGame.forEach((item) => {
      expect(item).toEqual({
        reportCount: expect.any(Number),
        Arcade: {
          id: expect.any(Number),
          name: expect.any(String),
          lat: expect.any(Number),
          lng: expect.any(Number),
          rating: expect.any(Number),
          ratingCount: expect.any(Number),
          BrandId: expect.any(Number),
          Brand: {
            id: expect.any(Number),
            name: expect.any(String),
            imageUrl: expect.any(String),
          },
        },
      });
    });
  });

  it("failed fetch games based on id 404", async function () {
    const response = await request(app)
      .get("/games/100")
      .set("Accept", "application/json")
      .set("access_token", access_token);
    expect(response.status).toEqual(404);
    expect(typeof response.body).toBe("object");
    expect(response.body).toHaveProperty("message");
  });
});

describe("GET  /brands", function () {
  it("Success get brands 200", async function () {
    const response = await request(app)
      .get("/brands")
      .set("Accept", "application/json")
      .set("access_token", access_token);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
    response.body.forEach((item) => {
      expect(item).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        imageUrl: expect.any(String),
      });
    });
  });

});
