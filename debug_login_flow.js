const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://testsub.proteinhunt.in/login', { waitUntil: 'networkidle' });

  console.log('Login page loaded, URL:', page.url());
  console.log('Username placeholder:', await page.locator('[placeholder="Enter your username"]').first().getAttribute('placeholder'));

  await page.fill('[placeholder="Enter your username"]', 'hemanthnalla1@gmail.com');
  await page.fill('[placeholder="Enter your password"]', 'Rgukt@123');
  await page.click('button:has-text("Sign In")');

  await page.waitForTimeout(5000);
  console.log('After login URL:', page.url());
  console.log('Page title after login:', await page.title());
  await browser.close();
})();
