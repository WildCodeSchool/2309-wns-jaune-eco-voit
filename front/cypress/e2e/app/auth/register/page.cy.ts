import { waitFor } from "@testing-library/react";
interface TableResult {
  rows: { tablename: string }[];
}

before(() => {
  cy.log("😭");
  cy.task("dbQuery", "SET session_replication_role = replica;")
    .then(() => {
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
      return Promise.all(
        tables.map((table) => {
          return cy.task(
            "dbQuery",
            `TRUNCATE TABLE "${table.tablename}" CASCADE;`
          );
        })
      );
    })
    .then(() => cy.task("dbQuery", "SET session_replication_role = DEFAULT;"))
    .then(() => {
      console.log("Nettoyage de la base de données terminé.");
    });
});

describe("Register user page", () => {
  it("should register a user", () => {
    cy.register("sakogm38@gmail.com");

    waitFor(() => {
      cy.url().should("eq", "http://localhost:3002/auth/login");
    });
  });

  it("should not register a user and display error if email is already used", () => {
    cy.register("sakogm38@gmail.com");

    cy.get("body").contains("Cet email est déjà utilisé").should("be.visible");
  });
});
