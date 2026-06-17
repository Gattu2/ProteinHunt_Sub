const { chromium } = require('playwright');
const users = require('./test-data/users');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ baseURL: 'https://testsub.proteinhunt.in' });
  try {
    await page.goto('/login');
    await page.fill('[placeholder="Enter your username"]', users.admin.email);
    await page.fill('[placeholder="Enter your password"]', users.admin.password);
    await Promise.all([
      page.waitForURL('**/admin', { timeout: 30000 }),
      page.click('button:has-text("Sign In"), button:has-text("Login")'),
    ]);
    await page.waitForSelector('a:has-text("Menu Items")', { timeout: 30000 });
    await Promise.all([
      page.waitForURL('**/admin/menu', { timeout: 30000 }),
      page.click('a:has-text("Menu Items")'),
    ]);
    await page.waitForTimeout(5000);
    console.log('URL', page.url());
    console.log('BODY text length', await page.evaluate(() => document.body.innerText.length));
    console.log('BODY html length', await page.evaluate(() => document.body.innerHTML.length));
    console.log('BODY snippet', await page.evaluate(() => document.body.innerHTML.slice(0, 2000).replace(/\n/g, ' ')));
    console.log('H1 texts', JSON.stringify(await page.locator('h1').allTextContents()));
    console.log('H1 selector count', await page.locator('h1:has-text("Menu Items")').count());
    const tabButtons = page.locator('button', { hasText: /Veg|NonVeg|Non-Veg|Veg & Egg/i });
    console.log('Filtered tab buttons count', await tabButtons.count());
    for (let i = 0; i < await tabButtons.count(); i++) {
      const b = tabButtons.nth(i);
      console.log('TAB', i, JSON.stringify((await b.textContent() || '').trim()), await b.getAttribute('aria-label'), await b.evaluate(el => el.outerHTML.replace(/\n/g, ' ')));
    }
    const cards = page.locator('div:has(h3)').filter({ has: page.locator('h3') });
    console.log('Card count (div:has(h3))', await cards.count());
    for (let i = 0; i < Math.min(await cards.count(), 10); i++) {
      const card = cards.nth(i);
      const h3 = await card.locator('h3').textContent();
      console.log('CARD', i, JSON.stringify(h3.trim()), 'outer', await card.evaluate(el => el.outerHTML.slice(0,240).replace(/\n/g, ' ')));
    }
  } catch (err) {
    console.error('ERR', err);
  } finally {
    await browser.close();
  }
})();
