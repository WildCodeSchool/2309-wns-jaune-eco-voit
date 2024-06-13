import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://backend:4000",
  documents: [
    "src/requetes/queries/*.queries.ts",
    "src/requetes/mutations/*.mutations.ts",
  ],
  generates: {
    "./src/types/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
    },
  },
};

export default config;
