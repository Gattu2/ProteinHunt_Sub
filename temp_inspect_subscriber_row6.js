const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://testsub.proteinhunt.in/login');
  await page.fill('[placeholder="Enter your username"]', 'hemanthnalla1@gmail.com');
  await page.fill('[placeholder="Enter your password"]', 'Rgukt@123');
  await page.click('button:has-text("Sign in"), button:has-text("Login")');
  await page.waitForURL(/(dashboard|admin|subscriber|chef)/, { timeout: 30000 });
  await page.click('text=Subscribers');
  await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  const headings = await page.$$eval('h1, h2, h3, h4, h5', els => els.map(el => el.innerText.trim()).filter(Boolean));
  console.log('ALL_HEADINGS', headings.slice(0,20));
  const matching = headings.filter(text => /subscribers?/i.test(text));
  console.log('SUBSCRIBER_HEADINGS', matching);
  await browser.close();
})();