const { test, expect } = require('@playwright/test');

// Test: Measure performance (time to load and extract articles)
test('Measure performance - Time to load and extract 100 articles', async ({ page }) => {
  // Start measuring performance time
  const startTime = Date.now();

  // Step 1: Navigate to Hacker News "newest" page
  await page.goto('https://news.ycombinator.com/newest');

  // Step 2: Wait for articles to load
  await page.waitForSelector('.athing', { timeout: 10000 }); // Wait up to 10 seconds

  // Step 3: Extract the first 100 articles' titles and ages
  const articles = await page.$$eval('.athing', (elements) =>
    elements.slice(0, 100).map(article => {
      const title = article.querySelector('.titleline > a')?.innerText || 'No Title';
      const ageText = article.querySelector('.age')?.innerText || null;
      return { title, ageText };
    })
  );

  // End measuring performance time
  const endTime = Date.now();
  const durationInSeconds = ((endTime - startTime) / 1000).toFixed(2);

  // Log performance results
  console.log(`✅ Time taken to load and extract 100 articles: ${durationInSeconds} seconds`);

  // Assertions
  expect(articles.length).toBeGreaterThanOrEqual(30); // Ensure at least 30 articles were loaded
  console.log(`✅ Total articles extracted: ${articles.length}`);

  // Ensure no missing or invalid titles
  for (const article of articles) {
    expect(article.title).not.toBe('No Title');
    expect(article.ageText).not.toBeNull();
  }

  console.log('✅ All articles have valid titles and ages.');
});