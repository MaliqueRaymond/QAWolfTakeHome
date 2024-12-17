const { test, expect } = require('@playwright/test');

// Helper Function to Convert Time Strings into Minutes
function convertToMinutes(timeString) {
  if (!timeString) return Infinity; // Treat missing time as invalid (large value)
  
  const [value, unit] = timeString.split(' ');
  const minutes = parseInt(value);

  if (isNaN(minutes)) return Infinity;

  switch (unit) {
    case 'minute':
    case 'minutes':
      return minutes;
    case 'hour':
    case 'hours':
      return minutes * 60;
    case 'day':
    case 'days':
      return minutes * 24 * 60;
    default:
      return Infinity;
  }
}

test('Validate that articles are sorted from newest to oldest', async ({ page }) => {
  // Navigate to Hacker News newest stories
  await page.goto('https://news.ycombinator.com/newest');

  // Wait for articles to load
  await page.waitForSelector('.athing', { timeout: 10000 });

  // Extract the first 100 articles' titles and age text
  const articles = await page.$$eval('.athing', (elements) =>
    elements.slice(0, 100).map(article => {
      const title = article.querySelector('.titleline > a')?.innerText || 'No Title';
      const ageText = article.querySelector('.age')?.innerText || null;
      return { title, ageText };
    })
  );

  // Ensure that 100 articles were loaded
  expect(articles.length).toBe(100);

  // Validate sorting from newest to oldest
  for (let i = 0; i < articles.length - 1; i++) {
    const currentAge = convertToMinutes(articles[i].ageText);
    const nextAge = convertToMinutes(articles[i + 1].ageText);

    if (currentAge > nextAge) {
      console.error(`Sorting issue found: "${articles[i].title}" (${articles[i].ageText}) comes before "${articles[i + 1].title}" (${articles[i + 1].ageText})`);
    }
    expect(currentAge).toBeLessThanOrEqual(nextAge); // Assert sorting order
  }

  console.log('✅ Articles are successfully sorted from newest to oldest.');
});