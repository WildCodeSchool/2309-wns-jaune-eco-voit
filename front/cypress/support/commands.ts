/// <reference types="cypress" />
import "@testing-library/cypress/add-commands";

declare global {
  namespace Cypress {
    interface Chainable {
      register(): Chainable<void>;
      login(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("register", () => {
  cy.visit("/auth/register");
  cy.url().should("eq", "http://localhost:3003/auth/register");

  cy.findByRole("textbox", { name: "Email" }).type("sakogm38@gmail.com");
  // Les textbox de mot de passe ont un role différent
  cy.findByLabelText("Mot de passe").type("sakogm38");
  cy.findByLabelText("Confirmez le mot de passe").type("sakogm38");
  cy.findByRole("textbox", { name: "Prénom" }).type("oliv");
  cy.findByRole("textbox", { name: "Nom" }).type("ier");
  cy.findByRole("textbox", { name: "Date de naissance" }).type("07/05/1992");

  cy.findByRole("button", { name: "S'inscrire" })
    .contains("S'inscrire")
    .click();
});

Cypress.Commands.add("login", () => {
  cy.visit("/auth/login");
  cy.url().should("eq", "http://localhost:3003/auth/login");

  cy.findByRole("textbox", { name: "Email" }).type("sakogm38@gmail.com");
  cy.findByLabelText("Mot de passe").type("sakogm38");
  cy.findByRole("button", { name: "Se connecter" }).click();

  cy.url().should("eq", "http://localhost:3003/");
});
