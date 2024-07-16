// interface TableResult {
//   rows: { tablename: string }[];
// }

// before(() => {
//   cy.log("😁");
//   cy.task("dbQuery", "SET session_replication_role = replica;")
//     .then(() => {
//       return cy.task(
//         "dbQuery",
//         `
//           SELECT tablename FROM pg_tables
//           WHERE schemaname = 'public';
//         `
//       );
//     })
//     .then((result: any) => {
//       console.log("😅", result);
//       const tables = (result as TableResult).rows;
//       return Promise.all(
//         tables.map((table) => {
//           return cy.task(
//             "dbQuery",
//             `TRUNCATE TABLE "${table.tablename}" CASCADE;`
//           );
//         })
//       );
//     })
//     .then(() => cy.task("dbQuery", "SET session_replication_role = DEFAULT;"))
//     .then(() => {
//       console.log("Nettoyage de la base de données terminé.");
//     });
// });
