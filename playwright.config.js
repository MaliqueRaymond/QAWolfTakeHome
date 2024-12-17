// playwright.config.js

const { defineConfig } = require('@playwright/test');

module.exports = ({
  testDir: './tests', // Specify the directory containing your tests
  timeout: 30000, // Set a 30-second timeout for each test
  retries: 1, // Retry failed tests once
  reporter: [['html', { outputFolder: 'test-results', open: 'never' }]], // HTML reporter, results saved in 'test-results'
  use: {
    browserName: 'chromium', // Run tests in Chromium browser
    headless: true, // Run tests in headless mode by default
    viewport: { width: 1280, height: 720 }, // Set the viewport size for your tests
    actionTimeout: 10000, // Set a 10-second timeout for each action
    ignoreHTTPSErrors: true, // Ignore HTTPS errors
    baseURL: 'http://localhost:3000', // Default base URL for your tests
    trace: 'on-first-retry', // Capture traces on the first retry
    video: 'on', // Record video during the tests
    screenshot: 'only-on-failure', // Take screenshots only if a test fails
  },
  projects: [
    {
      name: 'Desktop Chromium',
      use: { browserName: 'chromium' }, // Set Chromium as the browser
    },
    {
      name: 'Desktop Firefox',
      use: { browserName: 'firefox' }, // Set Firefox as another test project
    },
    {
      name: 'Desktop WebKit',
      use: { browserName: 'webkit' }, // Set WebKit as another test project
    },
  ],
});

