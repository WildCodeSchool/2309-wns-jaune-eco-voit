import { waitFor } from "@testing-library/react";

describe("Journey publish page", () => {
  it("Publish journey and leave message", () => {
    /*------ Login ------*/
    cy.login("sakogm38@gmail.com", "sakogm38");

    waitFor(() => {
      cy.url().should("eq", "http://localhost:3002/");
    });
    /*------ Journey publish page ------*/
    cy.findByRole("link", { name: "Publier un trajet" }).click();
    cy.url().should("eq", "http://localhost:3002/journey/publish");

    /*------ Departure ------*/
    cy.get("h3").contains("D'où partez-vous?");
    // button "Suivant" must be disabled if we don't have value in input
    cy.findByRole("button", { name: "Suivant" }).should("be.disabled");
    cy.findByRole("combobox").type("Paris");
    waitFor(() => {
      cy.findByRole("option", { name: "Paris" }).click();
    });
    cy.findByRole("button", { name: "Suivant" }).click();

    /*------ Arrival ------*/
    cy.get("h3").contains("Où allez-vous?");
    cy.findByRole("button", { name: "Suivant" }).should("be.disabled");
    cy.findByRole("combobox", { name: "Point d'arrivée" }).type("Grenoble");
    waitFor(() => {
      cy.findByRole("option", { name: "Grenoble" }).click();
    });
    cy.findByRole("button", { name: "Suivant" }).click();

    /*------ Date ------*/
    cy.get("h3").contains("Choisissez la date de votre départ");
    cy.findByRole("button", { name: "Next month" }).click();
    cy.findByRole("gridcell", { name: "8" }).click();
    cy.findByRole("button", { name: "Suivant" }).click();

    /*------ Time ------*/
    cy.get("h3").contains("Choisissez l'heure de votre départ");
    cy.findByRole("button", { name: "Suivant" }).click();

    /*------ Passengers ------*/
    cy.get("h3").contains("Combien de passagers acceptez-vous?");
    const passenSpinButton = cy.findByRole("spinbutton");
    // Initial value = 1
    passenSpinButton.should("have.value", "1");
    passenSpinButton.type("8").should("have.value", "8");
    cy.findByRole("button", { name: "Suivant" }).click();

    /*------ Price ------*/
    cy.get("h3").contains("Fixez le prix par passager");
    const priceSpinButton = cy.findByRole("spinbutton");
    priceSpinButton.should("have.value", "0");
    cy.findByRole("button", { name: "Suivant" }).should("be.disabled");
    priceSpinButton.type("{selectall}35").should("have.value", "35");
    cy.findByRole("button", { name: "Suivant" }).click();

    /*------ Automatic accept ------*/
    cy.get("h3").contains("Activer la réservation automatique?");
    cy.findByRole("checkbox", { name: "Réservation automatique" })
      .should("be.checked")
      .click()
      .should("not.be.checked");

    cy.findByRole("button", { name: "Terminer" }).click();

    /*------ Validation step ------*/
    cy.contains("Félicitations, votre trajet est en ligne!").should(
      "be.visible"
    );

    waitFor(() => {
      cy.url().should("include", "http://localhost:3002/journey/");
    });

    cy.contains("Félicitations, votre trajet est en ligne!").should(
      "be.visible"
    );

    waitFor(
      () => {
        cy.findByRole("textbox", { name: "Votre message" });
      },
      { timeout: 10000 }
    );
    cy.findByRole("textbox", { name: "Votre message" }).type(
      "Voici mon message"
    );
    cy.findByRole("button", { name: "Envoyer" }).click();

    cy.findByRole("textbox", { name: "Votre message" }).should("be.empty");
    cy.contains("Voici mon message").should("be.visible");
  });
});
