This is the link to my repository for this project it includes the completed assignment and my video that I have recorded and edited myself, I hope to hear from you soon and thank you for the opportunity.

https://github.com/MaliqueRaymond

USE npm install then node index.js to get node files and run the test !!!!!!!!!!!

QA Wolf - Playwright Script Submission
Overview
This repository contains a Playwright script that automates the process of checking if articles on Hacker News are sorted correctly from newest to oldest based on their timestamps. The script uses JavaScript and Playwright for browser automation to extract article data, compare timestamps, and log whether the articles are sorted as expected.

Table of Contents
Project Overview
Technologies Used
How to Run the Script
Script Walk-through
Importing Playwright
Browser Setup
Data Extraction
Time Conversion Logic
Validation Loop
Logging and Final Output
Video Walk-through
Project Overview
The script automates the process of checking whether the articles on Hacker News are correctly sorted from newest to oldest based on the timestamps provided in the articles. It uses Playwright for browser automation and compares the timestamps of the articles to ensure they are in proper order.

Technologies Used
JavaScript: The programming language used to write the script.
Playwright: A browser automation framework used to launch browsers, navigate pages, and interact with elements on the page.
How to Run the Script
Clone the repository to your local machine:

bash
Copy code
git clone <repository-url>
cd <repository-folder>
Install the required dependencies:

bash
Copy code
npm install
Run the script:

bash
Copy code
node index.js
The script will automatically open a Chromium browser, navigate to Hacker News, and check the order of the articles. If the articles are sorted correctly, you will see a message confirming this in the console.

Script Walk-through
Importing Playwright
At the top of the script, I import the Playwright library:

javascript
Copy code
const { chromium } = require('playwright');
Playwright allows us to control the browser programmatically. I’m using the Chromium browser here, but Playwright also supports Firefox and WebKit.

Browser Setup
The browser is launched using the chromium.launch() method. I ensure that the browser is visible for debugging purposes by passing the option headless: false. This opens a visible browser window while the script runs:

javascript
Copy code
const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();
Next, I navigate to the Hacker News Newest page:

javascript
Copy code
await page.goto('https://news.ycombinator.com/newest');
Data Extraction
I use Playwright's $$eval() method to extract data from the page. This method allows me to query all the articles with the .athing class and extract both their titles and their timestamps:

javascript
Copy code
const articles = await page.$$eval('.athing', (articles) => {
  return articles.slice(0, 100).map(article => {
    const title = article.querySelector('.titleline > a').innerText;
    const age = article.querySelector('.age').innerText;
    return { title, age };
  });
});
Time Conversion Logic
The timestamps like "5 minutes ago" or "2 hours ago" need to be converted into numeric values for comparison. I created a helper function convertToMinutes() that converts these time strings into a numerical value in minutes:

javascript
Copy code
function convertToMinutes(timeString) {
  let [value, unit] = timeString.split(' ');
  if (unit === 'minute' || unit === 'minutes') {
    return parseInt(value);
  } else if (unit === 'hour' || unit === 'hours') {
    return parseInt(value) * 60;
  } else if (unit === 'day' || unit === 'days') {
    return parseInt(value) * 24 * 60;
  }
  return 0;
}
Validation Loop
I loop through the list of articles and compare their timestamps to ensure they are in the correct order. The script checks that each article’s timestamp is newer or equal to the next article's timestamp. If any article is out of order, the script logs an error:

javascript
Copy code
for (let i = 0; i < articles.length - 1; i++) {
  const currentArticle = articles[i];
  const nextArticle = articles[i + 1];
  if (convertToMinutes(currentArticle.age) < convertToMinutes(nextArticle.age)) {
    console.error(`Articles out of order: "${currentArticle.title}" and "${nextArticle.title}"`);
    isSorted = false;
  }
}
Logging and Final Output
If the articles are sorted correctly, the script logs a success message:

javascript
Copy code
if (isSorted) {
  console.log('The articles are sorted from newest to oldest!');
} else {
  console.log('The articles are NOT sorted correctly.');
}