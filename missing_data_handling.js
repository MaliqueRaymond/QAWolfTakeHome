// Import Playwright
const { chromium } = require("playwright");

// Helper Function to Convert Time Strings into Minutes
function convertToMinutes(timeString) {
  if (!timeString) {
    return Infinity; // Return Infinity for invalid or missing time string
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

// Function to Compare Two Time Strings
function isNewerOrEqual(current, next) {
  const currentMinutes = convertToMinutes(current);
  const nextMinutes = convertToMinutes(next);
  return currentMinutes <= nextMinutes;
}

// Test: Handle articles with missing or undefined age
async function testMissingDataHandling() {
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

  // Filter articles with missing age text
  articles = articles.filter(article => article.ageText !== null);

  // Check if sorting logic still works after filtering
  let isSorted = true;
  for (let i = 0; i < articles.length - 1; i++) {
    const currentAge = articles[i].ageText;
    const nextAge = articles[i + 1].ageText;
    if (!isNewerOrEqual(currentAge, nextAge)) {
      console.error(`Sorting issue between articles: "${articles[i].title}" and "${articles[i + 1].title}"`);
      isSorted = false;
      break;
    }
  }

  if (isSorted) {
    console.log('The articles are sorted from newest to oldest!');
  } else {
    console.error('The articles are NOT sorted correctly.');
  }

  await browser.close();
}

// Run the test
(async () => {
  await testMissingDataHandling();
})();
