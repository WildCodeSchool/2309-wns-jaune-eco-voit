import { defineConfig } from "cypress";
import { Client } from "pg";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3002",
    setupNodeEvents(on) {
      on("task", {
        async dbQuery(requestString) {
          const client = new Client({
            user: "ecovoit_user",
            password: "ecovoit_password",
            database: "ecovoit",
            host: "localhost",
            port: 5435,
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
