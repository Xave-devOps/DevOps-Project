const express = require("express");
const bodyParser = require("body-parser");
const createStudentRoute = require("./Util/createStudent");
const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the public folder
app.use(express.static("public"));

// Use the create student route
app.use("/", createStudentRoute);

// Default route for the home page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Student Management System is running at http://localhost:${PORT}`);
});
