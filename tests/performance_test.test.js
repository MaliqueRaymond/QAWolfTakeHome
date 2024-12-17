const { test, expect } = require('@playwright/test');

// Playwright Test: Measure performance for loading and extracting 100 articles
test('Measure time to load and extract 100 articles', async ({ page }) => {
  // Start measuring the time
  const startTime = Date.now();

  // Navigate to Hacker News newest stories page
  await page.goto('https://news.ycombinator.com/newest');

  // Wait for the articles to load
  await page.waitForSelector('.athing');
  await page.waitForTimeout(3000); // Wait for additional 3 seconds to ensure all articles are loaded

  // Extract the first 100 articles
  let articles = await page.$$eval('.athing', (articles) => {
    return articles.slice(0, 100).map(article => {
      const titleElement = article.querySelector('.titleline > a');
      const ageElement = article.querySelector('.age');
      const title = titleElement ? titleElement.innerText : 'No Title';
      const ageText = ageElement ? ageElement.innerText : null;
      return { title, ageText };
    });
  });

  // End measuring time
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000; // in seconds

  // Log the results and assert that articles were extracted
  console.log(`Time taken to load and extract 100 articles: ${duration} seconds`);
  expect(articles.length).toBeGreaterThanOrEqual(100);
});
