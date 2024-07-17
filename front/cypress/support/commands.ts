/// <reference types="cypress" />
import "@testing-library/cypress/add-commands";

declare global {
  namespace Cypress {
    interface Chainable {
      register(email: string): Chainable<void>;
      login(email: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add("register", (email: string) => {
  cy.visit("/auth/register");
  cy.url().should(
    "eq",
    process.env.CYPRESS_BASE_URL
      ? `${process.env.CYPRESS_BASE_URL}/auth/register`
      : "http://localhost:3002/auth/register"
  );

  cy.findByRole("textbox", { name: "Email" }).type(email);
  // Les textbox de mot de passe ont un role différent
  cy.findByLabelText("Mot de passe").type("sakogm38");
  cy.findByLabelText("Confirmez le mot de passe").type("sakogm38");
  cy.findByRole("textbox", { name: "Prénom" }).type("oliv");
  cy.findByRole("textbox", { name: "Nom" }).type("ier");
  cy.findByRole("textbox", { name: "Date de naissance" }).type("07/05/1992");

  cy.findByRole("button", { name: "S'inscrire" }).click();
});

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/auth/login");
  cy.url().should(
    "eq",
    process.env.CYPRESS_BASE_URL
      ? `${process.env.CYPRESS_BASE_URL}/auth/login`
      : "http://localhost:3002/auth/login"
  );

  cy.findByRole("textbox", { name: "Email" }).type(email);
  cy.findByLabelText("Mot de passe").type(password);
  cy.findByRole("button", { name: "Se connecter" }).click();

  cy.url().should(
    "eq",
    process.env.CYPRESS_BASE_URL
      ? process.env.CYPRESS_BASE_URL
      : "http://localhost:3002"
  );
});
