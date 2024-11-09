async function submitLeaveApplication() {
    const form = document.getElementById('leaveForm');
    const formData = {
        classID: form.classID.value,
        studentID: form.studentID.value,
        leaveDate: form.leaveDate.value,
        reason: form.reason.value
    };

    const response = await fetch('/leave/apply-leave', {  // Absolute path
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    const result = await response.json();
    alert(result.message);
    fetchLeaveApplications();
}

async function fetchLeaveApplications() {
    const response = await fetch('/leave/get-leave-applications');  // Absolute path
    const applications = await response.json();
    const container = document.getElementById('leaveApplications');
    container.innerHTML = '';

    applications.forEach(app => {
        const appDiv = document.createElement('div');
        appDiv.innerHTML = `
            <p>Application ID: ${app.applicationID}</p>
            <p>Student ID: ${app.studentID}</p>
            <p>Class ID: ${app.classID}</p>
            <p>Leave Date: ${app.leaveDate}</p>
            <p>Reason: ${app.reason}</p>
            <p>Status: ${app.status}</p>
            <button onclick="updateApplicationStatus(${app.applicationID}, 'Approved')">Approve</button>
            <button onclick="updateApplicationStatus(${app.applicationID}, 'Disapproved')">Disapprove</button>
        `;
        container.appendChild(appDiv);
    });
}

async function updateApplicationStatus(applicationID, status) {
    const response = await fetch('/leave/update-application-status', {  // Absolute path
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationID, status })
    });
    const result = await response.json();
    alert(result.message);
    fetchLeaveApplications();
}

// Fetch the applications when the page loads
fetchLeaveApplications();
