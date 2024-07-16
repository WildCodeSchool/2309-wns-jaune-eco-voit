import { defineConfig } from "cypress";
import { Client } from "pg";

interface TableResult {
  rows: { tablename: string }[];
}

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3002",
    setupNodeEvents(on, config) {
      on("task", {
        async dbQuery(requestString) {
          console.log("RESULT", requestString);
          const client = new Client({
            user: "ecovoit_user",
            password: "ecovoit_password",
            database: "ecovoit",
            host: "localhost",
            port: 5435,
          });
          await client.connect();
          const res = await client.query(requestString);
          console.log("🏆", res);
          await client.end();
          return res;
          // return requestString;
        },
      });
    },
  },
});
