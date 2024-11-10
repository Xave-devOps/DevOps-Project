var express = require("express");
var bodyParser = require("body-parser");
var app = express();
const PORT = process.env.PORT || 5050;
var startPage = "index.html";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

//start page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/" + startPage);
});

//get search.js
app.get("/util/search.js", (req, res) => {
  res.sendFile(__dirname + "/util/search.js");
});

//get json 
app.get("/resources.json", (req, res) => {
  res.sendFile(__dirname + "/resources.json");
});

server = app.listen(PORT, function () {
  const address = server.address();
  const baseUrl = `http://${
    address.address == "::" ? "localhost" : address.address
  }:${address.port}`;
  console.log(`Student Management System project at: ${baseUrl}`);
});
module.exports = { app, server };
