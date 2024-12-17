const { test, expect } = require('@playwright/test');

// Test: Validate that dynamic content (articles) loads correctly
test('Validate dynamic content loads correctly on Hacker News', async ({ page }) => {
  // Step 1: Navigate to the Hacker News "newest" page
  await page.goto('https://news.ycombinator.com/newest');

  // Step 2: Wait for dynamic content (articles) to load
  await page.waitForSelector('.athing', { timeout: 10000 }); // Wait up to 10 seconds

  // Step 3: Count the loaded articles
  const articles = await page.locator('.athing');
  const articleCount = await articles.count();

  console.log(`✅ Total dynamic articles loaded: ${articleCount}`);

  // Step 4: Assert that at least 30 articles are loaded (minimum expected)
  expect(articleCount).toBeGreaterThanOrEqual(30);

  // Step 5: Extract and log the first 5 articles' titles as a sample check
  const sampleTitles = await articles.evaluateAll((elements) =>
    elements.slice(0, 5).map(article => {
      const titleElement = article.querySelector('.titleline > a');
      return titleElement ? titleElement.innerText : 'No Title';
    })
  );

  console.log('✅ Sample of loaded articles:');
  sampleTitles.forEach((title, index) => console.log(`${index + 1}. ${title}`));

  // Step 6: Assert that dynamic content (titles) is non-empty
  for (const title of sampleTitles) {
    expect(title).not.toBe('No Title'); // Ensure no empty or missing titles
  }
});