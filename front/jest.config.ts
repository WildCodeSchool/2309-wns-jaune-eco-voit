import type { Config } from "jest";

const config: Config = {
  coverageProvider: "v8",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  transform: {
    "^.+.(ts|js)x?$": "ts-jest",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|webp)$": "<rootDir>/__mocks__/fileMock.js",
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  preset: "ts-jest",
  testPathIgnorePatterns: ["\\node_modules\\", "<rootDir>/cypress/"],
};

export default config;
