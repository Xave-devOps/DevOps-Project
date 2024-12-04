const { describe, it } = require("mocha");
const { expect } = require("chai");
const { app, server } = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const fs = require("fs");
const sinon = require("sinon");

chai.use(chaiHttp);

let baseUrl;
let newStatus;

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

  describe("PUT /api/edit-attendance/:attendanceID", () => {
    it("should return 400 if the attendanceID is not a valid number", (done) => {
      // Invalid attendanceID (non-numeric)
      chai
        .request(baseUrl)
        .put("/api/edit-attendance/invalidID") // Invalid ID in URL
        .send({
          status: "Present",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.equal("Invalid attendanceID"); // Check for correct error message
          done();
        });
    });

    it("should return 400 if the status is not provided", (done) => {
      const attendanceID = 1; // A valid ID from db.json

      chai
        .request(baseUrl)
        .put(`/api/edit-attendance/${attendanceID}`)
        .send({}) // No status provided
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.equal("Status is required"); // Check for correct error message
          done();
        });
    });

    it("should return 404 if the attendance record is not found", (done) => {
      const attendanceID = 9999; // Invalid ID that doesn't exist in db.json

      chai
        .request(baseUrl)
        .put(`/api/edit-attendance/${attendanceID}`)
        .send({
          status: "Absent", // Valid status
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.equal("Attendance record not found"); // Check for correct error message
          done();
        });
    });

    it("should update an existing attendance record with a valid attendanceID and status", (done) => {
      const attendanceID = 1; // Valid ID from db.json
      const newStatus = "Absent"; // Status to update to

      chai
        .request(baseUrl)
        .put(`/api/edit-attendance/${attendanceID}`)
        .send({ status: newStatus }) // Send the valid status
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal(
            "Attendance status modified successfully!"
          );
          expect(res.body.attendanceRecord).to.have.property(
            "attendanceID",
            attendanceID
          );
          done();
        });
    });
    it("should return 500 if there is a file read/write error", (done) => {
      const attendanceID = 1; // Assume this is a valid ID in your db.json

      // Stub fs methods to simulate errors
      const readFileStub = sinon
        .stub(fs, "readFile")
        .throws(new Error("File read error"));
      chai
        .request(baseUrl)
        .put(`/api/edit-attendance/${attendanceID}`)
        .send({
          status: "Absent",
        })
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.error).to.equal("Failed to read or write database");

          // Restore fs.readFile method
          readFileStub.restore();
          done();
        });
    });
  });
});
