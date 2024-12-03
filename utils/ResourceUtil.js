const fs = require("fs");
const dbPath = "utils/db.json"; // Path to your database (JSON file)

// Get attendance records for a specific lesson and date
function getAttendanceByLesson(req, res) {
  const lessonID = parseInt(req.params.lessonID, 10);
  const date = req.query.date;
  const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  const attendanceRecords = db.attendance.filter(
    (record) => record.lessonID === lessonID && record.date === date
  );

  const attendanceWithNames = attendanceRecords.map((record) => {
    const student = db.students.find((s) => s.studentID === record.studentID);
    return {
      ...record,
      name: student ? student.name : "Unknown",
    };
  });

  res.json(attendanceWithNames);
}

// Update attendance status for attendance
function updateAttendanceStatus(req, res) {
  const attendanceID = parseInt(req.params.attendanceID, 10);
  const newStatus = req.body.status;

  const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  let attendance = db.attendance.find((r) => r.attendanceID === attendanceID);

  if (attendance) {
    attendance.status = newStatus;
    fs.writeFileSync(dbPath, JSON.stringify(db), "utf-8");
    res.json({ message: "Attendance updated successfully" });
  } else {
    res.status(404).json({ message: "Attendance record not found" });
  }
}

module.exports = { getAttendanceByLesson, updateAttendanceStatus };
