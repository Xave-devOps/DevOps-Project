describe("attendance frontend", () => {
  let baseUrl;

  before(() => {
    cy.task("startServer").then((url) => {
      baseUrl = url + "/attendance.html"; // Store the base URL
      cy.visit(baseUrl);
    });
  });

  after(() => {
    return cy.task("stopServer"); // Stop the server after the report is done
  });

  it("should load attendance records when lesson and date are selected", () => {
    cy.visit(baseUrl);
    cy.wait(1000);
    // Select a lesson and date to load attendance
    cy.get("#lessonSelect", { timeout: 10000 }).should("be.visible"); // Select "Science" as an example
    cy.get("#lessonSelect").select("Math (101)").should("have.value", "101");

    const date = "2024-11-07"; // Example date
    cy.get("#dateSelect").then((dropdown) => {
      dropdown.val(date); // Set the value
      dropdown.trigger("change"); // Trigger the change event
    });

    cy.get("#dateSelect").type(date).should("have.value", date);

    cy.get("#attendanceTable tbody tr")
      .first()
      .within(() => {
        cy.get("select")
          .select("Present") // Select "Present" as an example
          .should("have.value", "Present"); // Assert the value is updated to "Present"
      });
    cy.get("#attendanceTable tbody tr")
      .first()
      .find("td")
      .eq(2) // The third column (Status column)
      .should("exist"); // Verify that the status column exists
  });

  it("should update attendance status and reflect changes in the UI", () => {
    cy.visit(baseUrl);
    cy.wait(1000);
    // Select a lesson to load attendance
    cy.get("#lessonSelect", { timeout: 10000 }).should("be.visible");
    cy.get("#lessonSelect").select("Math (101)").should("have.value", "101");

    const date = "2024-11-07"; // Example date
    cy.get("#dateSelect").then((dropdown) => {
      dropdown.val(date); // Set the value
      dropdown.trigger("change"); // Trigger the change event
    });

    // Intercept the PUT request for updating attendance
    const attendanceID = 1; // Example attendance record ID
    const newStatus = "Late"; // The new status to update to
    cy.intercept("PUT", `/api/edit-attendance/${attendanceID}`, {
      statusCode: 200,
      body: {
        message: "Attendance status modified successfully!",
        attendanceRecord: { attendanceID, status: newStatus },
      },
    }).as("editAttendance");

    // Update attendance status
    cy.get("#attendanceTable tbody tr")
      .first()
      .within(() => {
        cy.get("select").select(newStatus).should("have.value", newStatus);
      });

    // Wait for the PUT request to be made
    cy.wait("@editAttendance");

    // Verify the UI reflects the updated status
    cy.get("#attendanceTable tbody tr")
      .first()
      .find("td")
      .eq(3) // The status column
      .should("contain.text", newStatus); // Confirm the status has updated in the UI
  });

  it("should redirect to index.html when goToHomePage is called", () => {
    // Visit the /admin page
    cy.visit(baseUrl);

    cy.get("#updateAttendance").should("be.visible").click();

    cy.location("pathname").should("contain", "index.html");
  });

  it("should prompt user to select a date if no date is selected", () => {
    cy.visit(baseUrl);
    cy.wait(1000);
    // Select a lesson and date to load attendance
    cy.get("#lessonSelect", { timeout: 10000 }).should("be.visible"); // Select "Science" as an example
    cy.get("#lessonSelect").select("Math (101)").should("have.value", "101");

    const date = " "; // Example date
    cy.get("#dateSelect").then((dropdown) => {
      dropdown.val(date); // Set the value
      dropdown.trigger("change"); // Trigger the change event
    });
  });
});
