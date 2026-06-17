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
    const addButton = page.getByRole('button', { name: /add menu item|add item|add/i }).first();
    console.log('add button count', await addButton.count());
    await addButton.click();
    const dialog = page.locator('[role="dialog"]').first();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    const menuTypeButton = dialog.locator('label:has-text("Menu Type")').locator('..').locator('[role="combobox"]').first();
    console.log('menu type button count', await menuTypeButton.count());
    await menuTypeButton.click();
    await page.waitForTimeout(500);
    const options = page.locator('[role="option"]');
    console.log('options count', await options.count());
    for (let i = 0; i < await options.count(); i++) {
      const opt = options.nth(i);
      console.log(i, 'text', await opt.textContent(), 'visible', await opt.isVisible());
      console.log('outerHTML', await opt.evaluate((el) => el.outerHTML));
    }
    const listboxes = page.locator('[role="listbox"]');
    console.log('listbox count', await listboxes.count());
    for (let i = 0; i < await listboxes.count(); i++) {
      const lb = listboxes.nth(i);
      console.log('listbox', i, 'visible', await lb.isVisible(), 'html', (await lb.innerHTML()).slice(0,1000));
    }
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();