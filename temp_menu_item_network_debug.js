const { chromium } = require('playwright');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/Admin_Pages/DashboardPage');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ baseURL: 'https://testsub.proteinhunt.in' });
  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', (err) => console.error('PAGE ERROR:', err));
  page.on('requestfailed', (req) => console.log('REQUEST FAILED:', req.url(), req.failure()?.errorText));
  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('/api') || url.includes('menu') || url.includes('Menu') || url.includes('menu-item') || url.includes('menuItem')) {
      console.log('RESPONSE', res.status(), url);
      try {
        const text = await res.text();
        if (text.length < 2000) console.log('RESP TEXT', text);
      } catch (err) {
        console.log('RESP READ ERROR', err.message);
      }
    }
  });
  try {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    await loginPage.goto();
    await loginPage.loginWithEmail('hemanthnalla1@gmail.com', 'Rgukt@123');
    await loginPage.verifyLoginSuccess();
    await dashboardPage.verifyLoaded();
    await dashboardPage.navigateToMenuItems();
    const itemName = `DebugItem ${Date.now()}`;
    const addButton = page.getByRole('button', { name: /Add Menu Item|Add Item|Add/i }).first();
    console.log('Add button count', await addButton.count());
    await addButton.click();
    const dialog = page.locator('[role="dialog"]').first();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    await dialog.locator('label:has-text("Name *")').locator('..').locator('input').fill(itemName);
    await dialog.locator('label:has-text("Description")').locator('..').locator('textarea').fill('Debug item desc');
    await dialog.locator('label:has-text("Calories")').locator('..').locator('input').fill('111');
    await dialog.locator('label:has-text("Protein")').locator('..').locator('input').fill('12');
    await dialog.locator('label:has-text("Carbs")').locator('..').locator('input').fill('13');
    await dialog.locator('label:has-text("Fat")').locator('..').locator('input').fill('14');
    await dialog.locator('label:has-text("Ingredients")').locator('..').locator('textarea').fill('debug');
    const menuTypeButton = dialog.locator('label:has-text("Menu Type")').locator('..').locator('[role="combobox"]').first();
    await menuTypeButton.click();
    await page.locator('[role="option"]', { hasText: 'Non-Veg' }).first().click();
    const createBtn = dialog.getByRole('button', { name: /Create|Save|Add/i }).first();
    console.log('Create button count', await createBtn.count());
    await createBtn.click();
    await page.waitForTimeout(5000);
    console.log('Dialog visible after submit?', await dialog.isVisible());
    console.log('page title', await page.title());
    console.log('body contains item name?', (await page.locator('body').innerText()).includes(itemName));
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();