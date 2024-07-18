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

Cypress.Commands.add("register", (email: string) => {
  cy.visit("/auth/register");
  console.log("BASEURL", baseUrl);
  cy.url().should("eq", `${baseUrl}/auth/register`);

  cy.findByRole("textbox", { name: "Email" }).type(email);
  // Les textbox de mot de passe ont un role différent
  cy.findByLabelText("Mot de passe").type("sakogm38");
  cy.findByLabelText("Confirmez le mot de passe").type("sakogm38");
  cy.findByRole("textbox", { name: "Prénom" }).type("oliv");
  cy.findByRole("textbox", { name: "Nom" }).type("ier");
  console.log("nom", cy.findByRole("textbox", { name: "Nom" }));

  cy.findByLabelText("Date de naissance").type("07/05/1992", {
    force: true,
  });

  cy.findByLabelText("S'inscrire").click();
});

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/auth/login");
  cy.url().should("eq", `${baseUrl}/auth/login`);

  cy.findByRole("textbox", { name: "Email" }).type(email);
  cy.findByLabelText("Mot de passe").type(password);
  cy.findByRole("button", { name: "Se connecter" }).click();

  waitFor(() => {
    cy.url().should("eq", baseUrl);
  });
});
