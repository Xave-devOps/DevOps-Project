describe("Student Management Frontend", () => {
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
    // Click the edit button for the resource
    cy.get("button.btn-warning").filter(':contains("Edit")').last().click();
    // // Update resource details
    cy.get("#editName").clear().type("Updated Resource", { force: true });
    cy.get("#editLocation").clear().type("Updated Location", { force: true });
    cy.get("#editDescription")
      .clear()
      .type("Updated Description", { force: true });
    cy.get("#editOwner").clear().type("updated@example.com", { force: true });
    // Click the update resource button
    cy.get("#updateButton").click();
    // Verify the resource is updated in the table
    cy.get("#tableContent").contains("Updated Resource").should("exist");
    cy.get("#tableContent").contains("Test Resource").should("not.exist");
  });
});
