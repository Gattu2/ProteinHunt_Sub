const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/Admin_Pages/DashboardPage');
const { MenuItemsPage } = require('../pages/Admin_Pages/MenuItemsPage');
const users = require('../test-data/users');

test('repro menu items navigation', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboard = new DashboardPage(page);
  const menuItems = new MenuItemsPage(page);

  await loginPage.goto();
  await loginPage.loginWithEmail(users.admin.email, users.admin.password);
  await loginPage.verifyLoginSuccess();
  await dashboard.verifyLoaded();
  await dashboard.navigateToMenuItems();
  console.log('page url', page.url());
  const h1Count = await page.locator('h1').count();
  console.log('h1 count', h1Count);
  for (let i = 0; i < h1Count; i++) {
    console.log(`h1[${i}] =`, await page.locator('h1').nth(i).textContent());
  }
  const menuHeadingCount = await page.locator('h1:has-text("Menu Items")').count();
  console.log('menuHeadingCount', menuHeadingCount);
  const menuHeadingVisible = await page.locator('h1:has-text("Menu Items")').first().isVisible().catch(() => false);
  console.log('menuHeadingVisible', menuHeadingVisible);
  const addClick = await page.getByRole('button', { name: /add menu item/i }).count();
  console.log('add menu item count', addClick);
});