describe("Resource Management Frontend", () => {
  let baseUrl;
  before(() => {
    cy.task("startServer").then((url) => {
      baseUrl = url; // Store the base URL
      cy.visit(baseUrl);
    });
  });
  after(() => {
    return cy.task("stopServer"); // Stop the server after the report is done
  });
  it("should update an existing attendance record", () => {
    cy.visit(baseUrl);

    // Select a lesson and date to load attendance
    cy.get("#lessonSelect").select("102").should("have.value", "102"); // Select "Science" as an example
    const date = "2024-12-05"; // Example date
    cy.get("#dateSelect").type(date).should("have.value", date);

    // Find the first row in the attendance table and locate the "Status" dropdown
    cy.get("#attendanceTable tbody tr")
      .first()
      .within(() => {
        // Select a new attendance status from the dropdown
        cy.get("select")
          .select("Present") // Select "Present" as an example
          .should("have.value", "Present"); // Assert the value is updated to "Present"
      });

    // Verify that the status in the table has been updated
    cy.get("#attendanceTable tbody tr")
      .first() // Check the first row (adjust if necessary)
      .find("td")
      .eq(2) // The third column (Status column)
      .should("contain.text", "Present"); // Verify that the status is now "Present"

    // Optionally, verify that the previous status is no longer in the table
    cy.get("#attendanceTable tbody tr")
      .first()
      .find("td")
      .eq(2)
      .should("not.contain.text", "Absent"); // Make sure the old status is gone
  });
});
