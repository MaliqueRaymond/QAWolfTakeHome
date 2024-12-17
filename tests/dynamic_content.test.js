const { test, expect } = require('@playwright/test');

// Playwright Test: Ensure the page has fully loaded before performing checks
test('Ensure dynamic content (articles) loads successfully', async ({ page }) => {
  // Navigate to Hacker News newest stories page
  await page.goto('https://news.ycombinator.com/newest');

  // Wait for the articles to load with a timeout of 10 seconds
  await page.waitForSelector('.athing', { timeout: 10000 });

  // Verify the number of articles loaded
  const articlesCount = await page.$$eval('.athing', (articles) => articles.length);

  // Assert that articles are present on the page
  expect(articlesCount).toBeGreaterThan(0);

  console.log(`Successfully loaded ${articlesCount} articles.`);
});
