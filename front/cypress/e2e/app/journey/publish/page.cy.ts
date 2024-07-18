import { waitFor } from "@testing-library/react";

interface TableResult {
  rows: { tablename: string }[];
}

const baseUrl = Cypress.config("baseUrl");

before(() => {
  cy.log("Starting database cleanup...");

  // Désactive les contraintes de clés étrangères
  cy.task("dbQuery", "SET session_replication_role = replica;")
    .then(() => {
      // Récupère toutes les tables sur schéma public
      return cy.task(
        "dbQuery",
        `
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public';
      `
      );
    })
    .then((result: any) => {
      const tables = (result as TableResult).rows;
      cy.log("TABLES", JSON.stringify(tables));

      // Vide toutes les tables
      return Promise.all(
        tables.map((table) => {
          cy.log("TABLE", JSON.stringify(table));

          return cy.task(
            "dbQuery",
            `TRUNCATE TABLE "${table.tablename}" CASCADE;`
          );
        })
      );
    })

    // Réactive toutes les contraintes de clés étrangères
    .then(() => cy.task("dbQuery", "SET session_replication_role = DEFAULT;"))
    .then(() => {
      cy.log("Nettoyage de la base de données terminé.");

      // Crée un utilisateur
      const createUserQuery = `
      INSERT INTO "user_entity" (id, firstname, lastname, email, password, "dateOfBirth", role, grade, "tripsAsPassenger", "tripsAsDriver", status, "createdAt")
      VALUES (
        uuid_generate_v4(),
        'Oliv',
        'Ier',
        "sakogm38@gmail.com",
        'sakogm38',
        '1992-05-06T22:00:00.000Z',
        'USER',
        'BEGINNER',
        0,
        0,
        'ACTIVE',
        now()
      );
    `;

      return cy.task("dbQuery", createUserQuery);
    })
    .then(() => {
      console.log("Utilisateur créé avec succès.");
    });
});

describe("Journey publish page", () => {
  it("Publish journey and leave message", () => {
    /*------ Login ------*/
    cy.login("sakogm38@gmail.com", "sakogm38");

    cy.url().should("eq", "http://localhost:3002/");

    /*------ Journey publish page ------*/
    cy.findByRole("link", { name: "Publier un trajet" }).click();
    cy.url().should("eq", `${baseUrl}/journey/publish`);

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
      cy.url().should("include", `${baseUrl}/journey/`);
    });

    cy.contains("Félicitations, votre trajet est en ligne!").should(
      "be.visible"
    );

    waitFor(() => {
      cy.findByRole("textbox", { name: "Votre message" });
    });
    cy.findByRole("textbox", { name: "Votre message" }).type(
      "Voici mon message"
    );
    cy.findByRole("button", { name: "Envoyer" }).click();

    cy.findByRole("textbox", { name: "Votre message" }).should("be.empty");
    cy.contains("Voici mon message").should("be.visible");
  });
});
