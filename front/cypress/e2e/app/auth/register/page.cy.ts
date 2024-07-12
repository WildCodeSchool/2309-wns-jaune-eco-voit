describe("Register user page", () => {
  it("should not register a user and display error if email is already used", () => {
    /*------ Register ------*/
    cy.register();

    cy.get("body").contains("Cet email est déjà utilisé").should("be.visible");
  });
});
