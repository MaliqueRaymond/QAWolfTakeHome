const { test, expect } = require('@playwright/test');

// Test: Ensure 100 articles have valid titles and ages
test('Ensure 100 articles have valid titles and ages', async ({ page }) => {
  // Navigate to Hacker News "newest" page
  await page.goto('https://news.ycombinator.com/newest');

  // Wait for the articles to load
  await page.waitForSelector('.athing', { timeout: 10000 });

  // Extract articles' titles and ages
  const articles = await page.$$eval('.athing', (elements) =>
    elements.slice(0, 100).map(article => {
      const title = article.querySelector('.titleline > a')?.innerText || 'No Title';
      const ageText = article.querySelector('.age')?.innerText || null;
      return { title, ageText };
    })
  );

  // Check the total number of articles
  console.log(`✅ Total articles loaded: ${articles.length}`);
  expect(articles.length).toBe(100); // Assert exactly 100 articles are loaded

  // Check for valid titles and ages
  let invalidArticles = [];

  for (const [index, article] of articles.entries()) {
    const hasTitle = article.title !== 'No Title';
    const hasAge = article.ageText !== null;

    if (!hasTitle || !hasAge) {
      console.warn(
        `⚠️ Warning: Article ${index + 1} is invalid - Title: "${article.title}", Age: "${article.ageText}"`
      );
      invalidArticles.push(article);
    }
  }

  // Log the number of invalid articles
  console.log(`⚠️ Total invalid articles: ${invalidArticles.length}`);

  // Assert that no articles have invalid titles or missing ages
  expect(invalidArticles.length).toBe(0);
});