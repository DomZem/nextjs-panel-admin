import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  verbose: true,
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"],

  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
  },

  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

async function hackJestConfig() {
  // createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
  const nextJestConfig = await createJestConfig(config)();
  // /node_modules/ is the first pattern, so overwrite it with the correct version
  if (nextJestConfig.transformIgnorePatterns) {
    nextJestConfig.transformIgnorePatterns[0] =
      "/node_modules/(?!(@blocknote))/";
    nextJestConfig.transformIgnorePatterns[1] =
      "/node_modules/(?!(lucide-react))/";
  }
  return nextJestConfig;
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default hackJestConfig;
