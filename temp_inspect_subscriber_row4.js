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
  const searchTexts = ['View', 'Details', 'Info', 'History', 'Legacy', 'Open', 'More'];
  for (const searchText of searchTexts) {
    const els = await page.$$(`button:has-text(\"${searchText}\"), a:has-text(\"${searchText}\"), span:has-text(\"${searchText}\"), div:has-text(\"${searchText}\")`);
    console.log(`FOUND ${searchText}:`, els.length);
    if (els.length > 0) {
      for (let i = 0; i < Math.min(5, els.length); i++) {
        console.log(`${searchText} #${i}:`, await els[i].evaluate((n) => n.outerHTML));
      }
    }
  }
  await browser.close();
})();