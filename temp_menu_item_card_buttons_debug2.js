const { chromium } = require('playwright');
const { LoginPage } = require('./pages/LoginPage');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ baseURL: 'https://testsub.proteinhunt.in' });
  try {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithEmail('hemanthnalla1@gmail.com', 'Rgukt@123');
    await loginPage.verifyLoginSuccess();
    await page.goto('/admin/menu');
    await page.waitForSelector('h1:has-text("Menu Items")', { timeout: 30000 });
    const cards = page.locator('div.bg-white/80.rounded-2xl, div.rounded-2xl').filter({ has: page.locator('h3') });
    console.log('card count', await cards.count());
    const max = Math.min(5, await cards.count());
    for (let i = 0; i < max; i++) {
      const card = cards.nth(i);
      const title = (await card.locator('h3').textContent())?.trim();
      console.log(`card ${i} title='${title}'`);
      const buttons = card.locator('button');
      console.log(' button count', await buttons.count());
      for (let j = 0; j < await buttons.count(); j++) {
        const btn = buttons.nth(j);
        const text = (await btn.textContent())?.trim().replace(/\s+/g, ' ') || '';
        const ariaLabel = await btn.getAttribute('aria-label');
        const titleAttr = await btn.getAttribute('title');
        const outer = await btn.evaluate((el) => el.outerHTML);
        console.log(`  btn ${j}: text='${text}' ariaLabel='${ariaLabel}' title='${titleAttr}' outer='${outer.slice(0,250)}'`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();