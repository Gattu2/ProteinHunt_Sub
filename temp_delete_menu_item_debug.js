const { chromium } = require('playwright');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/Admin_Pages/DashboardPage');
const { MenuItemsPage } = require('./pages/Admin_Pages/MenuItemsPage');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ baseURL: 'https://testsub.proteinhunt.in' });
  try {
    const loginPage = new LoginPage(page);
    const dashboard = new DashboardPage(page);
    const menuItems = new MenuItemsPage(page);
    await loginPage.goto();
    await loginPage.loginWithEmail('hemanthnalla1@gmail.com', 'Rgukt@123');
    await loginPage.verifyLoginSuccess();
    await dashboard.verifyLoaded();
    await dashboard.navigateToMenuItems();
    await menuItems.verifyLoaded();
    const itemName = 'Chicken Curry';
    const item = await menuItems.findMenuItemRow(itemName, 'NonVeg');
    console.log('item count', await item.count());
    if (await item.count() === 0) {
      console.log('Item not found to delete');
      return;
    }
    const deleteButton = await menuItems.findCardActionButton(item, /delete|trash|remove|trash-2/i);
    console.log('delete button count', await deleteButton.count());
    console.log('delete outerHTML', await deleteButton.evaluate(el => el.outerHTML));
    await deleteButton.click();
    await page.waitForTimeout(2000);
    const dialog = page.locator('[role="dialog"]');
    console.log('dialog count', await dialog.count());
    const visibleButtons = page.locator('button:visible');
    console.log('visible page button count', await visibleButtons.count());
    for (let i = 0; i < await visibleButtons.count(); i++) {
      const btn = visibleButtons.nth(i);
      console.log(`visible button[${i}] text='${await btn.textContent()}' aria='${await btn.getAttribute('aria-label')}' outer='${await btn.evaluate(el => el.outerHTML)}'`);
    }
    const deleteOrConfirmButtons = page.locator('button', { hasText: /delete|confirm|yes|cancel|no/i });
    console.log('deleteOrConfirmButtons count', await deleteOrConfirmButtons.count());
    for (let i = 0; i < await deleteOrConfirmButtons.count(); i++) {
      const btn = deleteOrConfirmButtons.nth(i);
      console.log(`filter button[${i}] text='${await btn.textContent()}' aria='${await btn.getAttribute('aria-label')}' outer='${await btn.evaluate(el => el.outerHTML)}' visible=${await btn.isVisible()}`);
    }
    const rowStill = await item.count();
    console.log('item row still count after click', rowStill);
    if (rowStill > 0) console.log('item row outer', await item.evaluate(el => el.outerHTML));
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();