// Import Playwright
const { chromium } = require("playwright");

// Helper Function to Convert Time Strings into Minutes
function convertToMinutes(timeString) {
  if (!timeString) {
    return Infinity;
  }

  let [value, unit] = timeString.split(' ');
  value = parseInt(value);

  if (isNaN(value)) {
    return Infinity;
  }

  switch (unit) {
    case 'minute':
    case 'minutes':
      return value;
    case 'hour':
    case 'hours':
      return value * 60;
    case 'day':
    case 'days':
      return value * 24 * 60;
    default:
      return Infinity;
  }
}

// Test: Ensure articles are extracted correctly
async function testArticleExtraction() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://news.ycombinator.com/newest");

  await page.waitForSelector('.athing');
  await page.waitForTimeout(3000);

  let articles = await page.$$eval('.athing', (articles) => {
    return articles.slice(0, 100).map(article => {
      const titleElement = article.querySelector('.titleline > a');
      const ageElement = article.querySelector('.age');
      const title = titleElement ? titleElement.innerText : 'No Title';
      const ageText = ageElement ? ageElement.innerText : null;
      return { title, ageText };
    });
  });

  // Assert that titles and ages are properly extracted
  for (let article of articles) {
    console.assert(article.title !== 'No Title', `Article title is missing: ${article.title}`);
    console.assert(article.ageText !== null, `Article age is missing: ${article.title}`);
  }

  console.log('All articles have valid titles and age data.');

  await browser.close();
}

// Run the test
(async () => {
  await testArticleExtraction();
})();
