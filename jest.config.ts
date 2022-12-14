import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.m?ts?$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.(m)?js$': '$1',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(m)?ts$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.mts',
    '!src/**/*.d.ts',
    '!src/**/*.d.mts',
  ],
  testPathIgnorePatterns: ['build', 'examples'],
};

export default config;
