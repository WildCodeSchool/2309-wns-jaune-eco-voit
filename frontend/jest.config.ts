/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // The test environment that will be used for testing
  testEnvironment: "jsdom",

  // The glob patterns Jest uses to detect test files
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // On a ajouté cette config a la main, elle indique a Jest omment transformer les fichiers TS en JS afin qu'ils puissent etre exécutés correctement lors des tests
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};

module.exports = config;
