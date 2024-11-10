document.addEventListener("DOMContentLoaded", function () {
  loadAttendance();
});

// Load attendance based on selected lesson
function loadAttendance() {
  const lessonID = document.getElementById("lessonSelect").value;
  const date = document.getElementById("dateSelect").value;

  // Ensure a date is selected before fetching data
  if (!date) {
    alert("Please select a date");
    return;
  }

  fetch(`/api/attendance/${lessonID}?date=${date}`)
    .then((response) => response.json())
    .then((attendance) => {
      const tableBody = document.getElementById("attendanceBody");
      tableBody.innerHTML = "";

      attendance.forEach((record) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${record.studentID}</td>
          <td>${record.name}</td>
          <td>${record.status}</td>
          <td>
            <select onchange="updateStatus(${record.attendanceID}, this.value)">
              <option value="Present" ${
                record.status === "Present" ? "selected" : ""
              }>Present</option>
              <option value="Absent" ${
                record.status === "Absent" ? "selected" : ""
              }>Absent</option>
              <option value="Late" ${
                record.status === "Late" ? "selected" : ""
              }>Late</option>
            </select>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error loading attendance:", error));
}

// Function to update attendance status
function updateStatus(attendanceID, newStatus) {
  fetch(`/api/attendance/${attendanceID}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  })
    .then((response) => response.json())
    .then((updatedRecord) => {
      console.log("Updated attendance:", updatedRecord);
    })
    .catch((error) => console.error("Error updating attendance:", error));
}
function refreshAttendance() {
  // Reloads the page to show updated attendance data
  location.reload();
}
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
function goToHomePage() {
  // Redirects to the homepage (index.html)
  window.location.href = "index.html";
}
