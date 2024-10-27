module.exports = {
    roots: ['<rootDir>'], // Let Jest search from the root directory
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'], // Ignore .next and node_modules folders
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'], // Global setup for tests
    testEnvironment: 'jsdom', // Set test environment to jsdom for testing React components
    testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'], // Find test files in __tests__ directory with .test.js or .test.jsx extensions
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest", // Use babel-jest to transform JS/JSX files
    },
    moduleNameMapper: {
      '\\.module\\.css$': 'identity-obj-proxy', // Mock CSS modules
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock other style files
    },
  };
  