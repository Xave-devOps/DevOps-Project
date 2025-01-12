const express = require("express");
const fs = require("fs").promises; // Use promises API for async file handling
const path = require("path");
const router = express.Router();

// Import the getAttendanceByLesson function from the new controller
const {
  getAttendanceByLesson,
} = require("../controllers/attendanceController");

// Path to your db.json file
const dbPath = path.join(__dirname, "db.json");

// Utility function to read JSON file asynchronously
async function readJSON(filename) {
  try {
    const data = await fs.readFile(filename, "utf8"); // Read the file asynchronously
    return JSON.parse(data); // Parse and return the data
  } catch (err) {
    console.error("Error reading the database:", err);
    throw err; // Propagate the error if reading fails
  }
}

// Utility function to write JSON data asynchronously
async function writeJSON(object, filename) {
  try {
    await fs.writeFile(filename, JSON.stringify(object, null, 2), "utf8"); // Write the updated data
  } catch (err) {
    console.error("Error writing to the database:", err);
    throw err; // Propagate the error if writing fails
  }
}

// Update attendance status function
const updateAttendanceStatus = async (req, res) => {
  const attendanceID = parseInt(req.params.attendanceID, 10); // Get the attendanceID from URL params
  const newStatus = req.body.status; // Get the new status from the request body

  // Check if attendanceID is a valid number
  if (isNaN(attendanceID)) {
    return res.status(400).json({ error: "Invalid attendanceID" });
  }

  // Check if status is provided, if not return a 400 error
  if (!newStatus) {
    return res.status(400).json({ error: "Status is required" });
  }

  try {
    const db = await readJSON(dbPath); // Read the database asynchronously
    const attendanceRecord = db.attendance.find(
      (record) => record.attendanceID === attendanceID
    );

    // If no record is found, return a 404 error
    if (!attendanceRecord) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    // Update the attendance status
    attendanceRecord.status = newStatus;
    await writeJSON(db, dbPath); // Write the updated database back to the file

    // Return success response with updated attendance record
    return res.status(200).json({
      message: "Attendance status modified successfully!",
      attendanceRecord,
    });
  } catch (err) {
    // Log the error and return a 500 status code for any other errors (e.g., file read/write errors)
    console.error("Error occurred while reading/writing the database:", err);
    return res.status(500).json({ error: "Failed to read or write database" });
  }
};

// Route to get attendance for a specific lesson
router.get("/api/view-attendance/:lessonID", getAttendanceByLesson); // Use the imported function

// Route to update attendance status
router.put("/api/edit-attendance/:attendanceID", updateAttendanceStatus);

module.exports = { getAttendanceByLesson, updateAttendanceStatus };
