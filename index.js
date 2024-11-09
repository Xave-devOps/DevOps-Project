var express = require("express");
var bodyParser = require("body-parser");
var app = express();
const PORT = process.env.PORT || 5050;
var startPage = "leave.html";
const cors = require('cors');
app.use(cors());

// Middleware for parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

// Import leave application routes from leaveapp.js
const leaveAppRoutes = require('./Util/leaveapp');

// Use leave application routes, prefixed with '/leave'
app.use('/leave', leaveAppRoutes);

// Main route to serve the homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/" + startPage);
});

// Start the server
server = app.listen(PORT, function () {
  const address = server.address();
  const baseUrl = `http://${address.address == "::" ? "localhost" : address.address
    }:${address.port}`;
  console.log(`Student Management System project at: ${baseUrl}`);
});

module.exports = { app, server };
