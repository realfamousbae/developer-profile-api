module.exports = {
  collectCoverageFrom: ['src/**/*.ts', '!src/generated/**', '!src/main.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: 'src/.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          ...require('./tsconfig.json').compilerOptions,
          module: 'ESNext',
        },
        useESM: true,
      },
    ],
  },
};
