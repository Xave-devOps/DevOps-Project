const { describe, it } = require("mocha");
const { expect } = require("chai");
const { app, server } = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

let baseUrl;

describe("Attendance API", () => {
  before(async () => {
    const { address, port } = await server.address();
    baseUrl = `http://${address == "::" ? "localhost" : address}:${port}`;
  });
  after(() => {
    return new Promise((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  });
  let attendanceID; // Variable to store the ID of the resource
  // Test Suite for editing resources
  describe("PUT /api/attendance/:id", () => {
    it("should update an existing attendance record", (done) => {
      console.log("Received attendanceID:", attendanceID);
      chai
        .request(baseUrl)
        .put(`/api/edit-attendance/${attendanceID}`)
        .send({
          status: "Updated Attendance Status",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal(
            "attendance status modified successfully!"
          );
          done();
        });
    });
  });
});
