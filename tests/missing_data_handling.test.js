const { test, expect } = require('@playwright/test');

test('Handle missing or invalid age data for articles', async ({ page }) => {
  await page.goto('https://news.ycombinator.com/newest');
  await page.waitForSelector('.athing', { timeout: 20000 });

  const articles = await page.$$eval('.athing', (elements) =>
    elements.slice(0, 100).map(article => ({
      title: article.querySelector('.titleline > a')?.innerText || 'No Title',
      ageText: article.querySelector('.age')?.innerText || null,
    }))
  );

  console.log(`✅ Total articles loaded: ${articles.length}`);
  expect(articles.length).toBeGreaterThanOrEqual(30);

  let invalidArticles = 0;
  for (const article of articles) {
    if (!article.ageText) {
      console.warn(`⚠️ Missing age for article: "${article.title}"`);
      invalidArticles++;
    }
  }

  console.log(`⚠️ Total articles with missing age: ${invalidArticles}`);
  expect(invalidArticles).toBeLessThanOrEqual(10); // Allow up to 10 invalid articles
});
