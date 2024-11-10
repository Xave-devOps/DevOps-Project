let data; // Global variable to hold the JSON data after loading

// Function to load JSON data from an external file
async function loadData() {
    try {
        const response = await fetch('resources.json');
        data = await response.json();
        console.log('Loaded resources.json')
    } catch (error) {
        console.error('Error loading JSON data:', error);
    }
}

// Function to search for a student by name or ID
function searchStudent() {
    if (!data) {
        alert("Data is still loading. Please try again in a moment.");
        return;
    }
    
    const input = document.getElementById("searchInput").value.trim().toLowerCase();
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = ""; // Clear previous results

    if (input == ''){
        alert("No input entered in search!");
        return;
    }

    console.log(input)
    // Find the student by ID or name
    const student = data.students.find(s => 
        s.studentID.toString() === input || s.name.toLowerCase().includes(input)
    );
    console.log(student)

    // Display the result
    if (student) {
        const studentClasses = data.enrollment.filter(e => e.studentID === student.studentID)
            .map(e => data.classes.find(c => c.classID === e.classID))
            .filter(Boolean);
        
        let studentDetails = `<h3>Student Details</h3>`;
        studentDetails += `<p><strong>ID:</strong> ${student.studentID}</p>`;
        studentDetails += `<p><strong>Name:</strong> ${student.name}</p>`;
        
        if (studentClasses.length > 0) {
            studentDetails += `<h4>Classes Enrolled</h4>`;
            studentClasses.forEach(c => {
                studentDetails += `<p><strong>Subject:</strong> ${c.subject}, <strong>Date:</strong> ${c.date}, <strong>Tutor:</strong> ${c.tutor}</p>`;
            });
        } else {
            studentDetails += `<p>No classes found for this student.</p>`;
        }

        resultDiv.innerHTML = studentDetails;
    } else {
        resultDiv.innerHTML = "<p>No student found with that ID or name.</p>";
    }
}

// Call loadData to load the data when the page loads
window.onload = loadData; 