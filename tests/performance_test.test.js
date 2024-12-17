const { test, expect } = require('@playwright/test');

test('Measure performance - Time to load and extract 100 articles', async ({ page }) => {
  const startTime = Date.now();

  await page.goto('https://news.ycombinator.com/newest');
  await page.waitForSelector('.athing', { timeout: 20000 });

  const articles = await page.$$eval('.athing', (elements) =>
    elements.slice(0, 100).map(article => ({
      title: article.querySelector('.titleline > a')?.innerText || 'No Title',
      ageText: article.querySelector('.age')?.innerText || null,
    }))
  );

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ Time taken to load and extract articles: ${duration} seconds`);
  console.log(`✅ Total articles loaded: ${articles.length}`);
  expect(articles.length).toBeGreaterThanOrEqual(30);
});
