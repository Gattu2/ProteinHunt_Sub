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
    const addBtn = page.getByRole('button', { name: /Add Menu Item/i }).first();
    await addBtn.click();
    const dialog = page.locator('[role="dialog"]').first();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    await dialog.locator('label:has-text("Name *")').locator('..').locator('input').fill(itemName);
    await dialog.locator('label:has-text("Description")').locator('..').locator('textarea').fill('Debug item desc');
    await dialog.locator('label:has-text("Calories")').locator('..').locator('input').fill('111');
    await dialog.locator('label:has-text("Protein")').locator('..').locator('input').fill('12');
    await dialog.locator('label:has-text("Carbs")').locator('..').locator('input').fill('13');
    await dialog.locator('label:has-text("Fat")').locator('..').locator('input').fill('14');
    await dialog.locator('label:has-text("Ingredients")').locator('..').locator('textarea').fill('debug');
    const menuType = 'NonVeg';
    const menuTypeButton = dialog.locator('label:has-text("Menu Type")').locator('..').locator('[role="combobox"]').first();
    await menuTypeButton.click();
    await page.locator('[role="option"]', { hasText: menuType }).first().click();
    await dialog.getByRole('button', { name: /Create|Save|Add/i }).first().click();
    await page.waitForTimeout(3000);
    console.log('After submit body includes item before tab click:', (await page.locator('body').innerText()).includes(itemName));
    const nonVegTab = page.getByRole('button', { name: /NonVeg|Non-Veg/i }).first();
    console.log('Tab count', await nonVegTab.count());
    await nonVegTab.click();
    await page.waitForTimeout(3000);
    console.log('After clicking NonVeg tab body includes item:', (await page.locator('body').innerText()).includes(itemName));
    const itemCount = await page.locator('h3', { hasText: itemName }).count();
    console.log('Item card count by name after tab click:', itemCount);
    if (itemCount > 0) {
      const html = await page.locator('h3', { hasText: itemName }).first().evaluate((el) => el.closest('div').outerHTML);
      console.log('Found card html snippet:', html.slice(0, 500));
    }
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();