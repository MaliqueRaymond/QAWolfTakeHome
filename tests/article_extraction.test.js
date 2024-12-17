const { test, expect } = require('@playwright/test');

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

// Playwright Test: Ensure articles are extracted correctly
test('Ensure articles have valid titles and ages', async ({ page }) => {
  // Navigate to Hacker News newest stories page
  await page.goto('https://news.ycombinator.com/newest');

  // Wait for articles to load
  await page.waitForSelector('.athing');
  await page.waitForTimeout(3000);

  // Extract articles (first 100)
  let articles = await page.$$eval('.athing', (articles) => {
    return articles.slice(0, 100).map(article => {
      const titleElement = article.querySelector('.titleline > a');
      const ageElement = article.querySelector('.age');
      const title = titleElement ? titleElement.innerText : 'No Title';
      const ageText = ageElement ? ageElement.innerText : null;
      return { title, ageText };
    });
  });

  // Validate extracted articles
  for (let article of articles) {
    expect(article.title).not.toBe('No Title');
    expect(article.ageText).not.toBeNull();
  }

  console.log('All articles have valid titles and age data.');
});
