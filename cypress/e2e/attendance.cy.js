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

  it("should update an existing attendance record", () => {
    cy.visit(baseUrl);
    cy.wait(1000);
    // Select a lesson and date to load attendance
    cy.get("#lessonSelect", { timeout: 10000 }).should("be.visible"); // Select "Science" as an example
    cy.get("#lessonSelect").select("Math (101)").should("have.value", "101");

    const date = "2024-11-07"; // Example date
    // cy.get("#dateSelect")
    //   .type(date, { force: true })
    //   .should("have.value", date);

    cy.get("#dateSelect").then((dropdown) => {
      dropdown.val(date); // Set the value
      dropdown.trigger("change"); // Trigger the change event
    });

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
