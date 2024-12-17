const { test, expect } = require('@playwright/test');

test('Ensure articles have valid titles and ages', async ({ page }) => {
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
    if (article.title === 'No Title' || !article.ageText) {
      console.warn(`⚠️ Invalid article detected - Title: "${article.title}", Age: "${article.ageText}"`);
      invalidArticles++;
    }
  }

  console.log(`⚠️ Total invalid articles: ${invalidArticles}`);
  expect(invalidArticles).toBe(0);
});
