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
    const name = 'Chicken Curry';
    const cards = page.locator(`div.rounded-2xl:has(h3:has-text("${name}"))`);
    console.log('cards count', await cards.count());
    for (let i = 0; i < await cards.count(); i++) {
      const card = cards.nth(i);
      console.log('--- card', i, 'outerHTML');
      console.log((await card.evaluate((el) => el.outerHTML)).slice(0, 2000));
      const buttons = card.locator('button');
      console.log(' buttons count', await buttons.count());
      for (let j = 0; j < await buttons.count(); j++) {
        const btn = buttons.nth(j);
        const text = (await btn.textContent())?.trim().replace(/\s+/g, ' ') || '';
        const ariaLabel = await btn.getAttribute('aria-label');
        const title = await btn.getAttribute('title');
        const classes = await btn.getAttribute('class');
        const svgCount = await btn.locator('svg').count();
        console.log(` button ${j}: text='${text}' ariaLabel='${ariaLabel}' title='${title}' classes='${classes}' svgCount=${svgCount}`);
        for (let k = 0; k < svgCount; k++) {
          const svg = btn.locator('svg').nth(k);
          const svgClass = await svg.getAttribute('class');
          console.log(`  svg ${k}: class='${svgClass}' outer='${(await svg.evaluate((el) => el.outerHTML)).slice(0,200)}'`);
        }
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();