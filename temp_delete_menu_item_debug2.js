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
    const beforeHtml = await item.evaluate(el => el.outerHTML);
    console.log('item outerHTML before click', beforeHtml.slice(0, 1200));
    const deleteButton = await menuItems.findCardActionButton(item, /delete|trash|remove|trash-2/i);
    console.log('delete button count', await deleteButton.count());
    console.log('delete button outer', await deleteButton.evaluate(el => el.outerHTML));
    await deleteButton.click();
    await page.waitForTimeout(2000);
    const itemAfter = await menuItems.findMenuItemRow(itemName, 'NonVeg');
    console.log('item count after click', await itemAfter.count());
    if (await itemAfter.count() > 0) {
      console.log('item outerHTML after click', (await itemAfter.evaluate(el => el.outerHTML)).slice(0, 1200));
    }
    const visibleButtons = await page.locator('button:visible').allTextContents();
    console.log('visible button texts', visibleButtons);
    const visibleButtonAria = await page.locator('button:visible').evaluateAll(nodes => nodes.map(n => ({text: n.textContent?.trim(), aria: n.getAttribute('aria-label')})));
    console.log('visible button aria data', visibleButtonAria);
    const visibleDialogs = await page.locator('[role="dialog"]').count();
    console.log('dialog count', visibleDialogs);
    const allDialogButtons = await page.locator('[role="dialog"] button').allTextContents();
    console.log('dialog buttons', allDialogButtons);
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();