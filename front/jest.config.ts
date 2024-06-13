import type { Config } from "jest";

import type { JestConfigWithTsJest } from "ts-jest";

// const jestConfig: JestConfigWithTsJest = {
//   // [...]
//   transform: {
//     // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
//     // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
//     "^.+\\.tsx?$": [
//       "ts-jest",
//       {
//         coverageProvider: "v8",
//         setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
//         testEnvironment: "jsdom",
//         transform: {
//           "^.+.(ts|js)x?$": "ts-jest",
//         },
//         testMatch: ["**/_tests_/**/*.[jt]s?(x)"],
//         moduleNameMapper: {
//           "^@/(.*)$": "<rootDir>/src/$1",
//         },
//         preset: "ts-jest",
//         testPathIgnorePatterns: ["\\node_modules\\", "<rootDir>/cypress/"],
//       },
//     ],
//   },
// };

const config: Config = {
  coverageProvider: "v8",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  transform: {
    "^.+.(ts|js)x?$": "ts-jest",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  preset: "ts-jest",
  testPathIgnorePatterns: ["\\node_modules\\", "<rootDir>/cypress/"],
};

export default config;
