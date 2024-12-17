const { chromium } = require('playwright');

// Helper Function to Convert Time Strings into Minutes
function convertToMinutes(timeString) {
  if (!timeString) return Infinity;

  let [value, unit] = timeString.split(' ');
  value = parseInt(value);

  if (isNaN(value)) return Infinity;

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

function isNewerOrEqual(current, next) {
  const currentMinutes = convertToMinutes(current);
  const nextMinutes = convertToMinutes(next);
  return currentMinutes <= nextMinutes;
}

// Main Script
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Navigating to Hacker News...');
  await page.goto('https://news.ycombinator.com/newest');

  console.log('Extracting the first 100 articles...');
  await page.waitForSelector('.athing');
  const articles = await page.$$eval('.athing', (elements) =>
    elements.slice(0, 100).map((article) => {
      const titleElement = article.querySelector('.titleline > a');
      const ageElement = article.querySelector('.age');
      return {
        title: titleElement ? titleElement.innerText : 'No Title',
        ageText: ageElement ? ageElement.innerText : null,
      };
    })
  );

  // Validate Sorting
  let isSorted = true;
  for (let i = 0; i < articles.length - 1; i++) {
    const currentAge = articles[i].ageText;
    const nextAge = articles[i + 1].ageText;
    if (!isNewerOrEqual(currentAge, nextAge)) {
      console.error(
        `Sorting issue between: "${articles[i].title}" and "${articles[i + 1].title}"`
      );
      isSorted = false;
      break;
    }
  }

  if (isSorted) {
    console.log('✅ The first 100 articles are sorted from newest to oldest.');
  } else {
    console.error('❌ The articles are NOT sorted correctly.');
  }

  await browser.close();
})();
