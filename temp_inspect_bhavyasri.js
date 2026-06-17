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
  const locator = page.locator('text=Bhavya, text=Bhavyasri, text=Bhavya Sri, text=Bhavyasri');
  const count = await locator.count();
  console.log('LOCATOR_COUNT', count);
  for (let i = 0; i < count; i++) {
    const element = locator.nth(i);
    console.log('ELEMENT_TEXT', await element.innerText());
    console.log('OUTER_HTML', await element.evaluate((n) => n.outerHTML));
    const parent = await element.evaluateHandle((n) => n.closest('tr'));
    if (parent) {
      console.log('ROW_HTML', await parent.evaluate((n) => n.outerHTML));
      const buttons = await parent.$$eval('button, a', (els) => els.map((el) => el.outerHTML));
      console.log('ROW_BUTTONS', buttons);
    }
  }
  await browser.close();
})();