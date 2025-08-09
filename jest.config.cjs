module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleDirectories: ['node_modules', 'src'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Handle other static assets
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(ts|tsx)?$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',
    }],
  },
};
