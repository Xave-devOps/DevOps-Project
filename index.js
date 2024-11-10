const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5050;
const cors = require('cors');
const path = require('path');

// Middleware setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files from the public folder

// Import leave application routes from leaveapp.js
const leaveAppRoutes = require('./util/leaveapp');

// Use leave application routes, prefixed with '/leave'
app.use('/leave', leaveAppRoutes);

// Serve search.js from the util directory (optional if included in public folder)
app.get("/util/search.js", (req, res) => {
  res.sendFile(path.join(__dirname, "util", "search.js"));
});

// Serve db.json from the data directory
app.get("/data/db.json", (req, res) => {
  res.sendFile(path.join(__dirname, "data", "db.json"));
});

// Import and use the create student route
const createStudentRoute = require("./util/createStudent");
app.use("/", createStudentRoute);

// Default route to serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Student Management System is running at http://localhost:${PORT}`);
});

module.exports = { app, server };
