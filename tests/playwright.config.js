// playwright.config.js
module.exports = {
  // Directory where your test files are stored
  testDir: './tests',

  // Global timeout for each test (in milliseconds)
  timeout: 30000,

  // Set the browser viewport size for all tests
  use: {
    headless: true,  // Run tests in headless mode (without browser UI)
    viewport: { width: 1280, height: 720 },  // Default viewport size for tests
    actionTimeout: 10000,  // Timeout for each action (like clicks, typing)
    ignoreHTTPSErrors: true,  // Ignore SSL certificate errors (useful for testing non-HTTPS sites)
  },

  // Reporters - useful for getting detailed test reports in different formats
  reporter: [['html', { open: 'never' }], ['json', { outputFile: 'test-results.json' }]],

  // Retry configuration (for flaky tests)
  retries: 2,  // Retry failed tests twice before marking them as failed

  // Use custom test environment settings (e.g., set browser context options)
  projects: [
    {
      name: 'chromium',  // Browser name: 'chromium', 'firefox', or 'webkit'
      use: { 
        browserName: 'chromium',  // You can also specify 'firefox' or 'webkit'
      },
    },
    {
      name: 'firefox',
      use: { 
        browserName: 'firefox',
      },
    },
    {
      name: 'webkit',
      use: { 
        browserName: 'webkit',  // For Safari tests
      },
    },
  ],
};
