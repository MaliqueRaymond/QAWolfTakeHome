const { test, expect } = require('@playwright/test');

// Test: Handle articles with missing or invalid age data
test('Handle missing or invalid age data for articles', async ({ page }) => {
  // Navigate to Hacker News newest stories
  await page.goto('https://news.ycombinator.com/newest');

  // Wait for articles to load
  await page.waitForSelector('.athing', { timeout: 10000 });

  // Extract articles' titles and ages
  const articles = await page.$$eval('.athing', (elements) =>
    elements.slice(0, 100).map(article => {
      const title = article.querySelector('.titleline > a')?.innerText || 'No Title';
      const ageText = article.querySelector('.age')?.innerText || null;
      return { title, ageText };
    })
  );

  // Handle missing or invalid age data
  let missingAgeCount = 0;

  for (const article of articles) {
    if (!article.ageText) {
      console.warn(`⚠️ Warning: Missing age for article "${article.title}"`);
      missingAgeCount++;
    }
  }

  console.log(`✅ Total articles checked: ${articles.length}`);
  console.log(`⚠️ Total articles with missing age: ${missingAgeCount}`);

  // Assert that most articles have valid age data (allowing some missing ages)
  const validAgeCount = articles.length - missingAgeCount;
  expect(validAgeCount).toBeGreaterThan(50); // Allow up to 50 articles to have missing age data
});