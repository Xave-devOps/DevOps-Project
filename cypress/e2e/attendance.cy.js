describe("attendance frontend", () => {
  let baseUrl;

  before(() => {
    // Increase the timeout for startServer task
    cy.task("startServer", null, { timeout: 120000 }) // 120 seconds (2 minutes)
      .then((url) => {
        baseUrl = url; // Store the base URL
        cy.visit(baseUrl); // Visit the base URL
        cy.url().should("eq", baseUrl);
        cy.log(baseUrl); // Log the base URL for debugging
        cy.wait(3000);
      });
  });

  after(() => {
    return cy.task("stopServer"); // Stop the server after the tests are complete
  });

  it("should update an existing attendance record", () => {
    cy.visit(baseUrl);
    cy.wait(1000);
    // Select a lesson and date to load attendance
    cy.get("#lessonSelect", { timeout: 10000 }).should('be.visible'); // Select "Science" as an example
    cy.get("#lessonSelect").select("Math (101)").should("have.value", "101");

    const date = "2024-11-07"; // Example date
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
      .should("contain.text", "Present"); // Verify that the status is now "Present"

    cy.get("#attendanceTable tbody tr")
      .first()
      .find("td")
      .eq(2)
      .should("not.contain.text", "Absent"); // Make sure the old status is gone
  });
});
