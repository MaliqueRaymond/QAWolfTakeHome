const { test, expect } = require('@playwright/test');

test('Validate dynamic content loads correctly on Hacker News', async ({ page }) => {
  await page.goto('https://news.ycombinator.com/newest');
  await page.waitForSelector('.athing', { timeout: 20000 });

  const articles = await page.locator('.athing');
  const count = await articles.count();

  console.log(`✅ Total dynamic articles loaded: ${count}`);
  expect(count).toBeGreaterThanOrEqual(30);

  const firstArticleTitle = await articles.first().locator('.titleline > a').innerText();
  console.log(`✅ First article title: "${firstArticleTitle}"`);
  expect(firstArticleTitle).not.toBe('');
});
