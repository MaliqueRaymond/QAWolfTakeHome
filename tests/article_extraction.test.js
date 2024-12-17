const { test, expect } = require('@playwright/test');

test('Ensure articles have valid titles and ages', async ({ page }) => {
  // Navigate to Hacker News newest stories
  await page.goto('https://news.ycombinator.com/newest');

  // Wait for the articles to load with increased timeout
  await page.waitForSelector('.athing', { timeout: 20000 });

  // Extract the first 100 articles
  const articles = await page.$$eval('.athing', (articles) =>
    articles.slice(0, 100).map(article => {
      const titleElement = article.querySelector('.titleline > a');
      const ageElement = article.querySelector('.age');
      return {
        title: titleElement ? titleElement.innerText : 'No Title',
        ageText: ageElement ? ageElement.innerText : null,
      };
    })
  );

  // Validate extracted data
  for (const article of articles) {
    expect(article.title).not.toBe('No Title');
    expect(article.ageText).not.toBeNull();
  }

  console.log(`Successfully loaded ${articles.length} articles.`);
});
