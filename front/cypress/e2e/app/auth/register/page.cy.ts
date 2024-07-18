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

      // Vide toutes les tables
      return Promise.all(
        tables.map((table) => {
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
      INSERT INTO "user_entity" (id, firstname, lastname, email, password, dateOfBirth, role, grade, tripsAsPassenger, tripsAsDriver, status, createdAt)
      VALUES (
        uuid_generate_v4(),
        'Oliv',
        'Ier',
        'sakogm38@gmail.com',
        '$argon2id$v=19$m=65536,t=3,p=4$Xm7/taqNkaEKuvBDjdm4lg$SgMsAr9hjSu4Va+M27J9esYip6BZrtBX3nKU0vkBWYY',
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

describe("Register user page", () => {
  it("should register a user", () => {
    cy.register("sakogm38@gmail.com");

    waitFor(() => {
      cy.url().should("eq", `${baseUrl}/auth/login`);
    });
  });

  it("should not register a user and display error if email is already used", () => {
    cy.register("sakogm38@gmail.com");

    cy.get("body").contains("Cet email est déjà utilisé").should("be.visible");
  });
});
