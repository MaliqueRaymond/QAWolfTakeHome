const { test, expect } = require('@playwright/test');

// Helper function to convert time strings into minutes
function convertToMinutes(timeString) {
  if (!timeString) return Infinity;
  const [value, unit] = timeString.split(' ');
  const minutes = parseInt(value);
  if (isNaN(minutes)) return Infinity;

  switch (unit) {
    case 'minute': case 'minutes': return minutes;
    case 'hour': case 'hours': return minutes * 60;
    case 'day': case 'days': return minutes * 24 * 60;
    default: return Infinity;
  }
}

test('Validate that articles are sorted from newest to oldest', async ({ page }) => {
  await page.goto('https://news.ycombinator.com/newest');
  await page.waitForSelector('.athing', { timeout: 20000 });

  const articles = await page.$$eval('.athing', (elements) =>
    elements.slice(0, 100).map(article => ({
      title: article.querySelector('.titleline > a')?.innerText || 'No Title',
      ageText: article.querySelector('.age')?.innerText || null,
    }))
  );

  console.log(`✅ Total articles loaded: ${articles.length}`);
  expect(articles.length).toBeGreaterThanOrEqual(30);

  for (let i = 0; i < articles.length - 1; i++) {
    const current = convertToMinutes(articles[i].ageText);
    const next = convertToMinutes(articles[i + 1].ageText);

    console.log(`Comparing: "${articles[i].title}" (${articles[i].ageText}) with "${articles[i + 1].title}" (${articles[i + 1].ageText})`);
    expect(current).toBeLessThanOrEqual(next);
  }

  console.log('✅ Articles are sorted from newest to oldest.');
});
