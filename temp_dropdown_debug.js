const { chromium } = require('playwright');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/Admin_Pages/DashboardPage');
const { SubscribersPage } = require('./pages/Admin_Pages/SubscribersPage');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ baseURL: 'https://testsub.proteinhunt.in' });
  try {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const subscribersPage = new SubscribersPage(page);
    await loginPage.goto();
    await loginPage.loginWithEmail('hemanthnalla1@gmail.com', 'Rgukt@123');
    await loginPage.verifyLoginSuccess();
    await dashboardPage.verifyLoaded();
    await dashboardPage.navigateToSubscribers();
    await subscribersPage.verifyLoaded();
    await subscribersPage.openAddSubscriberModal();
    const menuButton = subscribersPage.menuTypeSelect;
    console.log('menu button outerHTML', await menuButton.evaluate(el => el.outerHTML));
    await menuButton.click();
    await page.waitForTimeout(1000);
    const options = await page.locator('[role="option"], li, div').filter({ hasText: /Veg|Veg & Egg|Non-Veg/i }).all();
    console.log('options count', options.length);
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      console.log('option', i, 'visible', await opt.isVisible(), 'text', await opt.textContent());
      console.log(await opt.evaluate(el => el.outerHTML.slice(0, 500)));
    }
    const visibleOptions = await page.locator('[role="option"], li, div').filter({ hasText: /Veg|Veg & Egg|Non-Veg/i }).filter({ has: page.locator(':visible') }).all();
    console.log('visible options count via filter visible', visibleOptions.length);
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();