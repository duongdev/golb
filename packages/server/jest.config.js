module.exports = {
  moduleFileExtensions: ['js', 'json'],
  rootDir: './src',
  testEnvironment: 'node',
  testRegex: '.spec.js$',
  globalSetup: './utils/jestGlobalSetup.js',
  moduleDirectories: ['node_modules', 'src'],
  coveragePathIgnorePatterns: ['/node_modules/'],
}
