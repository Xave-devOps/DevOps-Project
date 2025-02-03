const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5050;
const dbPath = path.join(__dirname, "utils/db.json");
const logger = require("./logger");

// Middleware setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

const {
  updateAttendanceStatus,
  getAttendanceByLesson,
} = require("./utils/ResourceUtil");

app.get("/api/view-attendance/:lessonID", getAttendanceByLesson);
app.put("/api/edit-attendance/:attendanceID", updateAttendanceStatus);

// Import leave application routes from leaveapp.js
const leaveAppRoutes = require("./util/leaveapp");
app.use("/leave", leaveAppRoutes);

// Serve search.js from the util directory
app.get("/util/search.js", (req, res) => {
  res.sendFile(path.join(__dirname, "util", "search.js"));
});

// Serve db.json from the data directory
app.get("/data/db.json", (req, res) => {
  res.sendFile(dbPath);
});

// Import and use the create student route
const createStudentRoute = require("./util/createStudent");
app.use("/", createStudentRoute);

// Default route to serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const statusMonitor = require("express-status-monitor");
app.use(statusMonitor());

// Start the server
const server = app.listen(PORT, () => {
  console.log(
    `Student Management System is running at http://localhost:${PORT}`
  );
  logger.info(
    `Student Management System is running at http://localhost:${PORT}`
  );
  logger.error(`Example or error log`);
});

module.exports = { app, server };
