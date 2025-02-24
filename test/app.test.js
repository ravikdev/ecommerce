
import request from "supertest";
import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import app from "../server.js"; // Import your Express app

describe("Express App Tests", () => {
  let server;

  before((done) => {
    server = app.listen(0, () => done()); // Start the server on a random port
  });

  it("should return 200 and 'This is running' on the home route", async () => {
    const res = await request(app).get("/");
    expect(res.status).to.equal(200);
    expect(res.text).to.equal("This is running");
  });

  it("should return 404 for an unknown route", async () => {
    const res = await request(app).get("/unknown");
    expect(res.status).to.equal(404);
  });

  after(() => {
    server.close(); // Stop the server after tests
  });
});
