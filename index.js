const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const dbPath = path.join(__dirname, "/utils/db.json");

// Middleware to parse JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Endpoint to get attendance for a specific lesson
app.get("/api/attendance/:lessonID", (req, res) => {
  const lessonID = parseInt(req.params.lessonID, 10);
  const date = req.query.date;
  const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  // Filter attendance records by lessonID
  const attendanceRecords = db.attendance.filter(
    (record) => record.lessonID === lessonID && record.date === date
  );

  // Map attendance records to include student names
  const attendanceWithNames = attendanceRecords.map((record) => {
    const student = db.students.find((s) => s.studentID === record.studentID);
    return {
      ...record,
      name: student ? student.name : "Unknown", // Add the student's name or "Unknown" if not found
    };
  });

  res.json(attendanceWithNames);
});

// Endpoint to update attendance status
app.put("/api/attendance/:attendanceID", (req, res) => {
  const attendanceID = parseInt(req.params.attendanceID, 10);
  const newStatus = req.body.status;

  const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  const attendanceRecord = db.attendance.find(
    (record) => record.attendanceID === attendanceID
  );

  if (attendanceRecord) {
    attendanceRecord.status = newStatus;
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
    res.json(attendanceRecord);
  } else {
    res.status(404).json({ error: "Attendance record not found" });
  }
});

// Start the server
const PORT = 5050;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
