const { test, expect } = require('@playwright/test');

test('Ensure articles have valid titles and ages', async ({ page }) => {
  await page.goto('https://news.ycombinator.com/newest');

  // Wait for articles to load
  await page.waitForSelector('.athing', { timeout: 20000 });

  // Extract article data
  const articles = await page.$$eval('.athing', (elements) =>
    elements.slice(0, 100).map(article => {
      const titleElement = article.querySelector('.titleline > a');
      const ageElement = article.querySelector('.age');
      return {
        title: titleElement ? titleElement.innerText : 'No Title',
        ageText: ageElement ? ageElement.innerText : null,
      };
    })
  );

  // Check for titles and ages
  let validArticlesCount = 0;

  for (const article of articles) {
    if (article.ageText === null) {
      console.warn(`Warning: Missing age for article "${article.title}"`);
    } else {
      validArticlesCount++;
    }
    expect(article.title).not.toBe('No Title');
  }

  console.log(`✅ Successfully loaded ${validArticlesCount} articles with valid ages.`);
  expect(validArticlesCount).toBeGreaterThan(0); // Ensure at least some articles have valid data
});

