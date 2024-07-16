// import { Client } from "pg";

// const myFunc = (
//   on: Cypress.PluginEvents,
//   config: Cypress.PluginConfigOptions
// ) => {
//   on("task", {
//     async dbQuery(query: string) {
//       console.log("🙄🙄🙄", query);
//       const client = new Client({
//         user: "ecovoit_user",
//         password: "ecovoit_password",
//         database: "ecovoit",
//         host: "db_test",
//         port: 5432,
//       });
//       await client.connect();
//       const res = await client.query(query);
//       await client.end();
//       return res;
//     },
//   });
// };

// export default myFunc;
