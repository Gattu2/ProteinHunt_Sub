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
    await page.getByRole('button', { name: /add menu item|add item|add/i }).first().click();
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
    await dialog.getByRole('button', { name: /create|save|add/i }).first().click();
    await page.waitForTimeout(2000);
    const matchText = itemName.replace(/[^a-zA-Z0-9]+/g, '');
    const matches = page.locator(`text=${itemName}`);
    console.log('itemName', itemName, 'count', await matches.count());
    const cards = page.locator(`div:has-text("${itemName}")`);
    console.log('card count', await cards.count());
    const rows = page.locator('table tbody tr', { hasText: itemName });
    console.log('table row count', await rows.count());
    console.log('page text snippet:', (await page.locator('body').innerText()).slice(0, 1000));
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();