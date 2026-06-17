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
    const buttons = page.locator('button').filter({ hasText: /Veg|NonVeg|Non-Veg/i });
    console.log('buttons count', await buttons.count());
    for (let i = 0; i < await buttons.count(); i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const role = await button.getAttribute('role');
      const id = await button.getAttribute('id');
      const ariaPressed = await button.getAttribute('aria-pressed');
      const ariaExpanded = await button.getAttribute('aria-expanded');
      const className = await button.getAttribute('class');
      const outer = await button.evaluate((el) => el.outerHTML);
      console.log(`button[${i}] text=${text} role=${role} id=${id} aria-pressed=${ariaPressed} aria-expanded=${ariaExpanded} class=${className}`);
      console.log('outerHTML', outer);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();