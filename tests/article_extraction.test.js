const { test, expect } = require('@playwright/test');

test('Ensure articles have valid titles and handle missing ages', async ({ page }) => {
  // Navigate to Hacker News newest stories
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

  // Track valid articles
  let validArticlesCount = 0;

  // Check for titles and log missing ages
  for (const article of articles) {
    expect(article.title).not.toBe('No Title');
    if (article.ageText === null) {
      console.warn(`⚠️ Warning: Missing age for article "${article.title}"`);
    } else {
      validArticlesCount++;
    }
  }

  // Assert that at least some articles have valid ageText
  console.log(`✅ Successfully validated ${validArticlesCount} articles with valid ages.`);
  expect(validArticlesCount).toBeGreaterThan(10); // Ensure at least 10 articles have valid ageText
});
