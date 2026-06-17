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
    const itemName = `DebugItem ${Date.now()}`;
    const addButton = page.locator('button, [role="button"], input[type="button"], input[type="submit"]').filter({ hasText: /Add Menu Item|Add Menu Item/i }).first();
    console.log('Add button count', await addButton.count());
    await addButton.click();
    const dialog = page.locator('[role="dialog"]').first();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    console.log('Dialog visible:', await dialog.isVisible());
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
    await page.waitForTimeout(2000);
    console.log('Dialog visible after submit?', await dialog.isVisible());
    const errorMessages = page.locator('.field-error, .invalid-feedback, .error-message, .toast-message, .message, .alert, .form-error');
    console.log('Error count', await errorMessages.count());
    for (let i = 0; i < await errorMessages.count(); i++) {
      const msg = errorMessages.nth(i);
      console.log('error', i, await msg.textContent());
    }
    const bodyText = await page.locator('body').innerText();
    console.log('body text includes item name?', bodyText.includes(itemName));
    console.log('body snippet', bodyText.slice(0, 1200));
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();