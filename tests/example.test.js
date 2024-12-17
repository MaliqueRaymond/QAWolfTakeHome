const { test, expect } = require('@playwright/test');

test.describe('Hacker News Tests', () => {
  test('should load the homepage and check title', async ({ page }) => {
    // Navigate to the Hacker News homepage
    await page.goto('https://news.ycombinator.com/');

    // Check if the page title is correct
    await expect(page).toHaveTitle('Hacker News');
  });

  test('should display a list of stories', async ({ page }) => {
    // Navigate to the Hacker News homepage
    await page.goto('https://news.ycombinator.com/');

    // Check if stories exist on the page
    const stories = await page.locator('.athing');
    await expect(stories).toHaveCountGreaterThan(0);
  });

  test('should navigate to the first story link', async ({ page }) => {
    // Navigate to the Hacker News homepage
    await page.goto('https://news.ycombinator.com/');

    // Click the first story link
    const firstStory = await page.locator('.athing .titleline > a').first();
    const storyHref = await firstStory.getAttribute('href');

    await firstStory.click();

    // Ensure the page navigated to the correct link
    await expect(page).toHaveURL(storyHref);
  });

  test('should verify the presence of navigation links', async ({ page }) => {
    // Navigate to the Hacker News homepage
    await page.goto('https://news.ycombinator.com/');

    // Verify presence of navigation links
    const navLinks = ['new', 'past', 'comments', 'ask', 'show', 'jobs', 'submit'];
    for (const link of navLinks) {
      const navLink = page.locator(`a[href*="${link}"]`);
      await expect(navLink).toBeVisible();
    }
  });

  test('should check the footer content', async ({ page }) => {
    // Navigate to the Hacker News homepage
    await page.goto('https://news.ycombinator.com/');

    // Verify the footer contains specific text
    const footerLink = page.locator('a:has-text("Guidelines")');
    await expect(footerLink).toBeVisible();
  });
});
