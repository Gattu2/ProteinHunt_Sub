const { chromium } = require('playwright');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/Admin_Pages/DashboardPage');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ baseURL: 'https://testsub.proteinhunt.in' });
  try {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    await loginPage.goto();
    await loginPage.loginWithEmail('hemanthnalla1@gmail.com', 'Rgukt@123');
    await loginPage.verifyLoginSuccess();
    await dashboardPage.verifyLoaded();
    await dashboardPage.navigateToMenuItems();
    await page.waitForTimeout(2000);
    const tabElements = await page.locator('button, [role="tab"], [role="button"]').filter({ hasText: /Veg|NonVeg|Non-Veg|Veg & Egg/i }).all();
    console.log('Tabs count', tabElements.length);
    for (let i = 0; i < tabElements.length; i++) {
      const el = tabElements[i];
      const text = await el.textContent();
      const role = await el.getAttribute('role');
      const ariaSelected = await el.getAttribute('aria-selected');
      const id = await el.getAttribute('id');
      console.log(`tab ${i}: text='${text}' role='${role}' selected='${ariaSelected}' id='${id}'`);
    }
    const panels = await page.locator('[role="tabpanel"], section, div').filter({ hasText: /Calories|Protein|Carbs|Fat|Ingredients:/i }).all();
    console.log('Panels count', panels.length);
    for (let i = 0; i < Math.min(panels.length, 5); i++) {
      const panel = panels[i];
      const html = await panel.evaluate((el) => el.outerHTML.slice(0, 1000));
      const id = await panel.getAttribute('id');
      console.log(`panel ${i} id='${id}' htmlSnippet='${html.replace(/\n/g, '')}'`);
    }
    const itemCards = await page.locator('div:has-text("Calories:")').all();
    console.log('Item cards count', itemCards.length);
    for (let i = 0; i < Math.min(itemCards.length, 5); i++) {
      const card = itemCards[i];
      const outer = await card.evaluate((el) => el.outerHTML.slice(0, 500));
      console.log(`card ${i} outer='${outer.replace(/\n/g, '')}'`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();