const { chromium } = require('playwright');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/Admin_Pages/DashboardPage');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ baseURL: 'https://testsub.proteinhunt.in' });
  try {
    const loginPage = new LoginPage(page);
    const dashboard = new DashboardPage(page);
    await loginPage.goto();
    await loginPage.loginWithEmail('hemanthnalla1@gmail.com', 'Rgukt@123');
    await loginPage.verifyLoginSuccess();
    await dashboard.verifyLoaded();
    await dashboard.navigateToMenuItems();
    await page.waitForTimeout(2000);
    const name = 'Chicken Curry';
    const headings = page.locator('h3', { hasText: name });
    console.log('h3 count', await headings.count());
    for (let i = 0; i < await headings.count(); i++) {
      const h3 = headings.nth(i);
      console.log(`h3[${i}] text`, await h3.textContent());
      console.log('outerHTML', (await h3.evaluate(el => el.outerHTML)).slice(0, 300));
      const ancestors = await h3.evaluate(el => {
        const out = [];
        let node = el;
        for (let j = 0; j < 6 && node; j++) {
          out.push({ tag: node.tagName, classes: node.className, id: node.id, text: node.textContent?.trim().slice(0, 50) });
          node = node.parentElement;
        }
        return out;
      });
      console.log('ancestors', JSON.stringify(ancestors, null, 2));
    }
    const cards = page.locator('div:has(h3:has-text("'+name+'"))');
    console.log('card locator count', await cards.count());
    for (let i = 0; i < await cards.count(); i++) {
      const card = cards.nth(i);
      const html = await card.evaluate(el => el.outerHTML.slice(0, 1000));
      console.log(`card[${i}] outerHTML`, html.replace(/\n/g, ' '));
      console.log('card display', await card.evaluate(el => window.getComputedStyle(el).display));
    }
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();