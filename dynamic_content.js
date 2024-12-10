// Import Playwright
const { chromium } = require("playwright");

// Test: Ensure the page has fully loaded before performing checks
async function testDynamicContentHandling() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://news.ycombinator.com/newest");

  // Wait for the articles to be loaded
  await page.waitForSelector('.athing', { timeout: 10000 }); // Wait up to 10 seconds for articles to load

  // Ensure the page has fully loaded by checking the number of articles
  const articlesCount = await page.$$eval('.athing', (articles) => articles.length);
  console.assert(articlesCount > 0, 'No articles found on the page');

  console.log(`Successfully loaded ${articlesCount} articles`);

  await browser.close();
}

// Run the test
(async () => {
  await testDynamicContentHandling();
})();
