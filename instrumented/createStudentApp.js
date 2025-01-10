document.getElementById("createStudentForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent form from reloading the page

    // Get the form data
    const studentID = document.getElementById("studentID").value;
    const name = document.getElementById("name").value;

    try {
        // Send a POST request to the backend
        const response = await fetch("/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ studentID, name })
        });

        // Get the JSON response
        const result = await response.json();

        // Display the result message
        document.getElementById("responseMessage").textContent = result.message || result.error;

        // Clear the form inputs if the student was created successfully
        if (response.ok) {
            document.getElementById("createStudentForm").reset();
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("responseMessage").textContent = "An error occurred. Please try again.";
    }
});
