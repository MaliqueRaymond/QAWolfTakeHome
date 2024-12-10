// Import Playwright
const { chromium } = require("playwright");

// Helper Function to Convert Time Strings into Minutes
function convertToMinutes(timeString) {
  let [value, unit] = timeString.split(' '); // Split time string into value and unit
  value = parseInt(value); // Convert the value to an integer

  switch (unit) {
    case 'minute':
    case 'minutes':
      return value; // Already in minutes, no conversion needed
    case 'hour':
    case 'hours':
      return value * 60; // Convert hours to minutes
    case 'day':
    case 'days':
      return value * 24 * 60; // Convert days to minutes
    default:
      return Infinity; // Handle unexpected units by returning a large value
  }
}

// Function to Compare Two Time Strings
function isNewerOrEqual(current, next) {
  const currentMinutes = convertToMinutes(current);
  const nextMinutes = convertToMinutes(next);

  // "Current" article should be newer or the same time as the "next"
  return currentMinutes <= nextMinutes;
}

// Main Function to Sort and Validate Articles on Hacker News
async function sortHackerNewsArticles() {
  // Launch browser
  const browser = await chromium.launch({ headless: false }); // Set headless to true if you want to run without seeing the browser
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  // Extract the list of articles (first 100 articles)
  const articles = await page.$$eval('.athing', (articles) => {
    return articles.slice(0, 100).map(article => {
      const title = article.querySelector('.titleline > a').innerText;
      const ageElement = article.querySelector('.age'); // Get the age element, e.g., "5 minutes ago"
      const ageText = ageElement ? ageElement.innerText : null;
      return { title, ageText };
    });
  });

  // Check if the articles are sorted from newest to oldest
  let isSorted = true;
  
  for (let i = 0; i < articles.length - 1; i++) {
    const currentAge = articles[i].ageText;
    const nextAge = articles[i + 1].ageText;

    if (!isNewerOrEqual(currentAge, nextAge)) {
      isSorted = false;
      break;
    }
  }

  if (isSorted) {
    console.log('The articles are sorted from newest to oldest!');
  } else {
    console.error('The articles are NOT sorted correctly.');
  }

  await browser.close(); // Close the browser
}

// Execute the Main Function
(async () => {
  await sortHackerNewsArticles();
})();

