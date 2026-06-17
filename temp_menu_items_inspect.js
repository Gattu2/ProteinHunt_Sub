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
    const buttons = await page.locator('button').allTextContents();
    console.log('Buttons:', buttons.filter((t) => t.trim().length > 0));
    const links = await page.locator('a').allTextContents();
    console.log('Links:', links.filter((t) => t.trim().length > 0).slice(0, 50));
    const menuTypeTabs = await page.locator('button, div, span').filter({ hasText: /Veg|Non-Veg|Veg & Egg/i }).allTextContents();
    console.log('Menu type tabs:', menuTypeTabs);
    const listText = await page.locator('main, section, div').filter({ hasText: /CALORIES|PROTEIN|CARBS|FAT|Manage your meal offerings|Add Menu Item/i }).allTextContents();
    console.log('Menu items section snippets (first 20):', listText.slice(0, 20));
    const menuItemsVisible = await page.locator('text=/[A-Z].+/').allTextContents();
    console.log('Sample visible text lines:', menuItemsVisible.slice(0, 50));
    const menuTypeFilter = page.locator('text=/Veg|Veg & Egg|Non-Veg/i').filter({ has: page.locator(':visible') });
    console.log('Menu type filter count', await menuTypeFilter.count());
    for (let i = 0; i < await menuTypeFilter.count(); i++) {
      console.log('Filter', i, await menuTypeFilter.nth(i).textContent());
    }
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();