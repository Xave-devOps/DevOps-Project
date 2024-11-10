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
