const { test, expect } = require('@playwright/test');

// Helper Function to Convert Time Strings into Minutes
function convertToMinutes(timeString) {
  if (!timeString) {
    return Infinity; // Handle null or undefined input
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
    return false; // If either value is null or undefined, we assume the comparison is false
  }

  const currentMinutes = convertToMinutes(current);
  const nextMinutes = convertToMinutes(next);

  return currentMinutes <= nextMinutes; // "Current" article should be newer or the same time as "next"
}

// Playwright Test to Validate Article Sorting
test.describe('Hacker News Sorting Tests', () => {
  test('Validate articles are sorted from newest to oldest', async ({ page }) => {
    // Go to Hacker News newest stories page
    await page.goto('https://news.ycombinator.com/newest');

    // Wait for articles to load
    await page.waitForSelector('.athing');
    await page.waitForTimeout(3000); // Additional wait to ensure all articles load

    // Extract list of articles (first 100)
    let articles = await page.$$eval('.athing', (articles) => {
      return articles.slice(0, 100).map(article => {
        const titleElement = article.querySelector('.titleline > a');
        const ageElement = article.querySelector('.age');
        const title = titleElement ? titleElement.innerText : 'No Title';
        const ageText = ageElement ? ageElement.innerText : null;
        return { title, ageText };
      });
    });

    // Filter out articles with missing age info
    articles = articles.filter(article => article.ageText !== null);

    // Check if articles are sorted correctly
    let isSorted = true;
    for (let i = 0; i < articles.length - 1; i++) {
      const currentAge = articles[i].ageText;
      const nextAge = articles[i + 1].ageText;
      console.log(`Comparing: ${articles[i].title} (${currentAge}) vs ${articles[i + 1].title} (${nextAge})`);

      if (!isNewerOrEqual(currentAge, nextAge)) {
        console.error(`Sorting issue between: "${articles[i].title}" and "${articles[i + 1].title}"`);
        isSorted = false;
        break;
      }
    }

    // Expectation: Articles are sorted
    expect(isSorted).toBeTruthy();
  });
});
