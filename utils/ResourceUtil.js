const fs = require("fs").promises; // Use promises API for async file handling
const path = require("path");

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
    const db = await readJSON(filename); // Read existing data
    await fs.writeFile(filename, JSON.stringify(db, null, 2), "utf8"); // Write the updated data
    return db;
  } catch (err) {
    console.error("Error writing to the database:", err);
    throw err; // Propagate the error if writing fails
  }
}

// Get attendance for a specific lesson
const getAttendanceByLesson = async (req, res) => {
  const lessonID = parseInt(req.params.lessonID, 10); // Get lessonID from URL params
  const date = req.query.date; // Get date from query parameters

  try {
    const db = await readJSON(dbPath); // Read the database asynchronously
    const attendanceRecords = db.attendance.filter(
      (record) => record.lessonID === lessonID && record.date === date
    );

    const attendanceWithNames = attendanceRecords.map((record) => {
      const student = db.students.find((s) => s.studentID === record.studentID);
      return {
        ...record,
        name: student ? student.name : "Unknown", // Return the student's name or "Unknown"
      };
    });

    res.status(200).json(attendanceWithNames); // Respond with the filtered attendance data
  } catch (err) {
    return res.status(500).json({ error: "Failed to read database" });
  }
};

// Update attendance status
const updateAttendanceStatus = async (req, res) => {
  const attendanceID = parseInt(req.params.attendanceID, 10);
  const newStatus = req.body.status;

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
    return res.status(500).json({ error: "Failed to read or write database" });
  }
};

module.exports = { getAttendanceByLesson, updateAttendanceStatus };
