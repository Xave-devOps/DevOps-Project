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

  fetch(`/api/view-attendance/${lessonID}?date=${date}`)
    .then((response) => response.json())
    .then((attendance) => {
      const tableBody = document.getElementById("attendanceBody");
      tableBody.innerHTML = "";

      attendance.forEach((attendance) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${attendance.studentID}</td>
          <td>${attendance.name}</td>
          <td>${attendance.status}</td>
          <td>
            <select onchange="updateStatus(${
              attendance.attendanceID
            }, this.value)">
              <option value="Present" ${
                attendance.status === "Present" ? "selected" : ""
              }>Present</option>
              <option value="Absent" ${
                attendance.status === "Absent" ? "selected" : ""
              }>Absent</option>
              <option value="Late" ${
                attendance.status === "Late" ? "selected" : ""
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
  fetch(`/api/edit-attendance/${attendanceID}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  })
    .then((response) => response.json())
    .then((newStatus) => {
      console.log("Updated attendance:", newStatus);
    })
    .catch((error) => console.error("Error updating attendance:", error));
}
function refreshAttendance() {
  // Reloads the page to show updated attendance data
  location.reload();
}

function goToHomePage() {
  // Redirects to the homepage (index.html)
  window.location.href = "index.html";
}
