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

    const links = page.locator('a, button, [role="link"], [role="button"], div[role="link"], div[role="button"]');
    const count = await links.count();
    console.log('Total link/button-like elements:', count);
    let found = 0;
    for (let i = 0; i < count; i++) {
      if (i >= 200) break;
      const el = links.nth(i);
      const text = (await el.textContent())?.trim().replace(/\s+/g, ' ') || '';
      if (/menu items|menu/i.test(text)) {
        const tag = await el.evaluate((node) => node.tagName.toLowerCase());
        const role = await el.getAttribute('role');
        const href = await el.getAttribute('href');
        const onclick = await el.getAttribute('onclick');
        const ariaCurrent = await el.getAttribute('aria-current');
        console.log(`candidate ${found}: tag=${tag} role=${role} text='${text}' href='${href}' onclick='${onclick}' aria-current='${ariaCurrent}'`);
        found++;
      }
    }
    const menuBtn = page.locator('a:has-text("Menu Items"), button:has-text("Menu Items"), [role="link"]:has-text("Menu Items"), [role="button"]:has-text("Menu Items")');
    console.log('Menu Items candidate count:', await menuBtn.count());
    if (await menuBtn.count() > 0) {
      for (let i = 0; i < await menuBtn.count(); i++) {
        const el = menuBtn.nth(i);
        console.log('menu item element outerHTML:', (await el.evaluate((node) => node.outerHTML)).slice(0, 500));
      }
    }

    const adminLinks = page.locator('nav a, nav button, nav [role="link"], nav [role="button"]');
    console.log('Nav candidate count', await adminLinks.count());
    for (let i = 0; i < await adminLinks.count(); i++) {
      const el = adminLinks.nth(i);
      const text = (await el.textContent())?.trim().replace(/\s+/g, ' ') || '';
      if (/menu|subscribers|deliveries|requests|kitchen|time slots/i.test(text)) {
        console.log('nav item', i, text, await el.evaluate((node) => node.outerHTML).slice(0, 300));
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();