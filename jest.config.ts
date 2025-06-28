import { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testRegex: '.*\\.spec\\.ts$',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/shared/**',
    '!src/modules/**/application/dtos/*.ts',
    '!src/database/**',
    '!src/modules/**/*.module.ts',
    '!src/modules/**/domain/entities/*.ts',
    '!src/app.module.ts',
  ],
  coverageDirectory: 'coverage',
};

export default config;
