import { defineConfig } from "cypress";
import { Client } from "pg";

interface TableResult {
  rows: { tablename: string }[];
}

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3002",
    setupNodeEvents(on) {
      on("task", {
        async dbQuery(requestString) {
          const client = new Client({
            user: "ecovoit_user",
            password: "ecovoit_password",
            database: "ecovoit",
            host: "localhost",
            port: 5434,
          });
          await client.connect();
          const res = await client.query(requestString);
          await client.end();
          return res;
        },
      });
    },
  },
});
