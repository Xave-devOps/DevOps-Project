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

// Get attendance for a specific lesson function
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

module.exports = { getAttendanceByLesson };
