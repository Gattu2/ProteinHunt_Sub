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
    console.log('Dashboard loaded, URL', page.url());
    await dashboard.navigateToMenuItems();
    console.log('after navigate URL', page.url());
    const headingText = await page.locator('h1').allTextContents();
    console.log('h1 texts', headingText);
    const menuHeading = await page.locator('h1:has-text("Menu Items")').count();
    console.log('menu heading count', menuHeading);
    const addBtnCount = await page.getByRole('button', { name: /add menu item/i }).count();
    console.log('add menu item count', addBtnCount);
  } catch (err) {
    console.error('ERROR', err);
  } finally {
    await browser.close();
  }
})();