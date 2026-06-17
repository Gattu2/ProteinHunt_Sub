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
    await page.waitForLoadState('networkidle');
    console.log('URL after navigate:', page.url());
    const headingCount = await page.getByRole('heading', { name: /menu items/i }).count();
    console.log('heading count', headingCount);
    if (headingCount > 0) {
      const visible = await page.getByRole('heading', { name: /menu items/i }).first().isVisible();
      console.log('heading visible', visible);
      console.log('heading text', await page.getByRole('heading', { name: /menu items/i }).first().textContent());
    }
    console.log('body snippet:', (await page.locator('body').innerText()).slice(0, 500));
    const addBtnCount = await page.getByRole('button', { name: /add menu item/i }).count();
    console.log('add button count', addBtnCount);
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();