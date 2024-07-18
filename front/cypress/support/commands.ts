/// <reference types="cypress" />
import "@testing-library/cypress/add-commands";
import { waitFor } from "@testing-library/react";

declare global {
  namespace Cypress {
    interface Chainable {
      register(email: string): Chainable<void>;
      login(email: string, password: string): Chainable<void>;
    }
  }
}

const baseUrl = Cypress.config("baseUrl");

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/auth/login");
  cy.url().should("eq", `${baseUrl}/auth/login`);

  cy.findByRole("textbox", { name: "Email" }).type(email);
  cy.findByLabelText("Mot de passe").type(password);
  cy.findByRole("button", { name: "Se connecter" }).click();
});
