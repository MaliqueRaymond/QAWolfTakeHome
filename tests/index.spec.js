// Import Playwright
const { chromium } = require("playwright");

// Helper Function to Convert Time Strings into Minutes
function convertToMinutes(timeString) {
  if (!timeString) {
    // Handle null or undefined input
    return Infinity; // Returning Infinity to indicate an invalid or missing time string
  }

  let [value, unit] = timeString.split(' '); // Split time string into value and unit
  value = parseInt(value); // Convert the value to an integer

  if (isNaN(value)) {
    return Infinity; // Return Infinity if the value cannot be parsed correctly
  }

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
  if (!current || !next) {
    // If either value is null or undefined, we assume the comparison is false
    return false;
  }

  const currentMinutes = convertToMinutes(current);
  const nextMinutes = convertToMinutes(next);

  // "Current" article should be newer or the same time as the "next"
  return currentMinutes <= nextMinutes;
}

// Main Function to S ort and Validate Articles on Hacker News
async function sortHackerNewsArticles() {
  // Launch browser
  const browser = await chromium.launch({ headless: false }); // Set headless to true if you want to run without seeing the browser
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  // Wait for the articles to load fully
  await page.waitForSelector('.athing');
  await page.waitForTimeout(3000); // Wait for an additional 3 seconds to ensure all articles are loaded

  // Extract the list of articles (first 100 articles)
  let articles = await page.$$eval('.athing', (articles) => {
    return articles.slice(0, 100).map(article => {
      const titleElement = article.querySelector('.titleline > a');
      const ageElement = article.querySelector('.age'); // Get the age element, e.g., "5 minutes ago"
      const title = titleElement ? titleElement.innerText : 'No Title';
      const ageText = ageElement ? ageElement.innerText : null; // Make sure to handle cases where ageElement is null
      return { title, ageText };
    });
  });

  // Filter out articles with missing age information
  articles = articles.filter(article => article.ageText !== null);

  // Check if the articles are sorted from newest to oldest
  let isSorted = true;

  for (let i = 0; i < articles.length - 1; i++) {
    const currentAge = articles[i].ageText;
    const nextAge = articles[i + 1].ageText;

    // Log detailed information for debugging
    console.log(`Comparing Articles: "${articles[i].title}" (${currentAge}) and "${articles[i + 1].title}" (${nextAge})`);

    if (!isNewerOrEqual(currentAge, nextAge)) {
      console.log(`Sorting issue between articles: "${articles[i].title}" and "${articles[i + 1].title}"`);
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
