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
    console.log('URL:', page.url());

    const tabs = page.locator('button, a, div').filter({ hasText: /Veg|NonVeg|Non-Veg|Veg & Egg/i });
    console.log('Tabs count (text match):', await tabs.count());
    for (let i = 0; i < await tabs.count(); i++) {
      const tab = tabs.nth(i);
      const text = (await tab.textContent())?.trim().replace(/\s+/g, ' ') || '';
      const role = await tab.getAttribute('role');
      const classes = await tab.getAttribute('class');
      const ariaCurrent = await tab.getAttribute('aria-current');
      const dataState = await tab.getAttribute('data-state');
      console.log(`tab[${i}] text='${text}' role='${role}' aria-current='${ariaCurrent}' data-state='${dataState}' class='${classes}'`);
    }

    const headings = await page.locator('h3').allTextContents();
    console.log('h3 count', headings.length);
    console.log('h3 samples:', headings.slice(0, 30));

    const cardDivs = page.locator('div[class*="rounded-2xl"]').filter({ has: page.locator('h3') });
    console.log('rounded card count', await cardDivs.count());
    for (let i = 0; i < Math.min(10, await cardDivs.count()); i++) {
      const card = cardDivs.nth(i);
      const title = (await card.locator('h3').textContent())?.trim();
      console.log(`card[${i}] title='${title}'`);
    }

    const items = page.locator('div:has-text("Calories")');
    console.log('Calories card count', await items.count());
    for (let i = 0; i < Math.min(10, await items.count()); i++) {
      const card = items.nth(i);
      console.log(`item[${i}] title='${(await card.locator('h3').textContent())?.trim()}'`);
    }

    const nonVegCard = page.locator('div:has(h3:has-text("Chicken Curry"))');
    console.log('Chicken Curry card count', await nonVegCard.count());
    if (await nonVegCard.count() > 0) {
      const html = await nonVegCard.first().evaluate((el) => el.outerHTML);
      console.log('Chicken Curry card html:', html.slice(0, 1200));
      const buttons = nonVegCard.first().locator('button');
      console.log('Buttons in Chicken Curry card:', await buttons.count());
      for (let j = 0; j < await buttons.count(); j++) {
        const btn = buttons.nth(j);
        console.log(` btn[${j}] text='${(await btn.textContent())?.trim()}' aria='${await btn.getAttribute('aria-label')}' title='${await btn.getAttribute('title')}' class='${await btn.getAttribute('class')}'`);
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
})();