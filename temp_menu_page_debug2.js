const { chromium } = require('playwright');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/Admin_Pages/DashboardPage');
const { MenuPage } = require('./pages/Admin_Pages/MenuPage');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ baseURL: 'https://testsub.proteinhunt.in' });
  try {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const menuPage = new MenuPage(page);
    await loginPage.goto();
    await loginPage.loginWithEmail('hemanthnalla1@gmail.com', 'Rgukt@123');
    await loginPage.verifyLoginSuccess();
    await dashboardPage.verifyLoaded();
    await dashboardPage.navigateToMenu();
    await menuPage.verifyLoaded();
    const menuName = `Debug Menu ${Date.now()}`;
    await menuPage.createMenu(menuName, 'Non-Veg');
    await page.waitForTimeout(1000);
    const row = await menuPage.findMenuRow(menuName);
    console.log('findMenuRow count', await row.count());
    if (await row.count() > 0) {
      console.log('outerHTML', await row.first().evaluate(el => el.outerHTML));
      const h3 = row.locator('h3').first();
      console.log('h3 count', await h3.count());
      if (await h3.count() > 0) {
        console.log('h3 text', await h3.textContent());
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();