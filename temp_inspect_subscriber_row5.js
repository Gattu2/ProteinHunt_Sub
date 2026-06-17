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
  const searchText = ['Search', 'search', 'Contact', 'Subscription', 'History', 'Legacy', 'Details', 'Information'];
  for (const text of searchText) {
    const count = await page.locator(`text=/${text}/i`).count();
    console.log(`${text}:`, count);
  }
  const textSnippets = await page.$$eval('body *', (els) => els
    .filter((el) => el.childElementCount === 0 && el.innerText.trim().length > 0)
    .map((el) => el.innerText.trim())
    .slice(0, 100)
  );
  console.log('SNIPPETS', textSnippets.join(' | '));
  await browser.close();
})();