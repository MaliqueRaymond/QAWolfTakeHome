const { test, expect } = require('@playwright/test');

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

// Playwright Test: Validate convertToMinutes Function
test('Validate convertToMinutes function', () => {
  expect(convertToMinutes('5 minutes')).toBe(5);
  expect(convertToMinutes('2 hours')).toBe(120);
  expect(convertToMinutes('1 day')).toBe(1440);
  expect(convertToMinutes('invalid input')).toBe(Infinity);
  expect(convertToMinutes(null)).toBe(Infinity);
});

// Playwright Test: Ensure sorting logic works with articles
test('Handle articles with missing or undefined age', async ({ page }) => {
  await page.goto('https://news.ycombinator.com/newest');

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

  // Assert that sorting logic works
  expect(isSorted).toBeTruthy();
  console.log('The articles are sorted from newest to oldest!');
});
