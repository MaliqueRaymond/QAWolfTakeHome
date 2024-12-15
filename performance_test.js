// Import Playwright
const { chromium } = require("playwright");

// Test: Measure the time taken to load and extract the data for 100 articles
async function testPerformance() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Start measuring the time
  const startTime = Date.now();

  await page.goto("https://news.ycombinator.com/newest");

  // Wait for the articles to load
  await page.waitForSelector('.athing');
  await page.waitForTimeout(3000); // Wait for additional 3 seconds to ensure all articles are loaded

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

  console.log(`Time taken to load and extract 100 articles: ${duration} seconds`);

  await browser.close();
}

// Run the test
(async () => {
  await testPerformance();
})();
