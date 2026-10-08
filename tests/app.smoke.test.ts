import request from "supertest";
import app from "../src/app";

// Stops the Prisma client from loading; these requests are rejected before any query runs.
jest.mock("../src/utils/db", () => ({ prisma: {} }));

describe("API smoke tests", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("reports that the API is running", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "active", message: "CoSpace API is running" });
  });

  it("rejects a booking create without an Authorization header", async () => {
    const res = await request(app).post("/bookings").send({});

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ status: "fail", error: "Unauthorized" });
  });

  it("rejects a non-numeric booking id", async () => {
    const res = await request(app).get("/bookings/abc");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Booking id must be a positive integer");
  });

  it("rejects a malformed JSON body", async () => {
    const res = await request(app)
      .post("/bookings")
      .set("Content-Type", "application/json")
      .send("{bad");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Malformed JSON in request body");
  });
});
