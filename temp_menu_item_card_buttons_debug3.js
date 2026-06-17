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
    const nonVegTab = page.locator('button:has-text("NonVeg"), button:has-text("Non-Veg"), a:has-text("NonVeg"), a:has-text("Non-Veg")').first();
    console.log('nonVegTab count', await nonVegTab.count());
    if (await nonVegTab.count() > 0) {
      console.log('nonVegTab text', await nonVegTab.textContent());
      await nonVegTab.click();
      await page.waitForTimeout(1000);
    }
    const visibleCards = page.locator('div.rounded-2xl:visible').filter({ has: page.locator('h3') });
    console.log('visible card count', await visibleCards.count());
    for (let i = 0; i < Math.min(5, await visibleCards.count()); i++) {
      const card = visibleCards.nth(i);
      const title = (await card.locator('h3').textContent())?.trim();
      console.log(`card ${i} title='${title}'`);
      const html = await card.evaluate((el) => el.outerHTML.slice(0, 1200));
      console.log(html.replace(/\n/g, ' '));
      const buttons = card.locator('button');
      console.log(' button count:', await buttons.count());
      for (let j = 0; j < await buttons.count(); j++) {
        const btn = buttons.nth(j);
        const text = (await btn.textContent())?.trim().replace(/\s+/g, ' ') || '';
        console.log(`  btn ${j} text='${text}' aria='${await btn.getAttribute('aria-label')}' title='${await btn.getAttribute('title')}' class='${await btn.getAttribute('class')}'`);
        const svgs = btn.locator('svg');
        for (let k = 0; k < await svgs.count(); k++) {
          console.log(`   svg ${k} class='${await svgs.nth(k).getAttribute('class')}'`);
        }
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
})();