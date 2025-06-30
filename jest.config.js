/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main.ts',
    '!<rootDir>/src/shared/**',
    '!<rootDir>/src/database/**',
    '!<rootDir>/src/modules/**/*.module.ts',
    '!<rootDir>/src/modules/**/application/dtos/*.ts',
    '!<rootDir>/src/modules/**/domain/entities/*.ts',
    '!<rootDir>/src/app.module.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
};
