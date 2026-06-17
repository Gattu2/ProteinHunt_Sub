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
  const headings = await page.$$eval('[role=heading]', els => els.map(el => ({ role: el.getAttribute('role'), text: el.innerText.trim().slice(0,100), tag: el.tagName }))); 
  console.log('ROLE_HEADINGS', headings.slice(0,20));
  const subHeadings = headings.filter(h => /subscribers?/i.test(h.text));
  console.log('SUBSCRIBER_ROLE_HEADINGS', subHeadings);
  await browser.close();
})();