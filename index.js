const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5050;
const cors = require('cors');
const path = require('path');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

// Import leave application routes from leaveapp.js
const leaveAppRoutes = require('./util/leaveapp');

// Use leave application routes, prefixed with '/leave'
app.use('/leave', leaveAppRoutes);

// Serve the main homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "leave.html"));
});

// Serve search.js from the util directory
app.get("/util/search.js", (req, res) => {
  res.sendFile(path.join(__dirname, "util", "search.js"));
});

// Serve resources.json
app.get("/resources.json", (req, res) => {
  res.sendFile(path.join(__dirname, "resources.json"));
});

// Start the server
const server = app.listen(PORT, () => {
  const baseUrl = `http://localhost:${PORT}`;
  console.log(`Student Management System project at: ${baseUrl}`);
});

module.exports = { app, server };
