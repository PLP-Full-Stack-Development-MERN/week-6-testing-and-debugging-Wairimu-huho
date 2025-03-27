module.exports = {
    testEnvironment: 'node',
    verbose: true,
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
      'controllers/**/*.js',
      'models/**/*.js',
      'routes/**/*.js',
      'utils/**/*.js',
      'middleware/**/*.js',
      '!**/node_modules/**',
      '!**/tests/**',
    ],
    setupFilesAfterEnv: ['./tests/setup.js'],
  };