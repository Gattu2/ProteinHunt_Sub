const { chromium } = require('playwright');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/Admin_Pages/DashboardPage');
const { MenuPage } = require('./pages/Admin_Pages/MenuPage');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ baseURL: 'https://testsub.proteinhunt.in' });
  try {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const menuPage = new MenuPage(page);
    await loginPage.goto();
    await loginPage.loginWithEmail('hemanthnalla1@gmail.com', 'Rgukt@123');
    await loginPage.verifyLoginSuccess();
    await dashboardPage.verifyLoaded();
    await dashboardPage.navigateToMenu();
    await menuPage.verifyLoaded();
    const menuName = `Debug Menu ${Date.now()}`;
    console.log('Creating menu', menuName);
    await menuPage.createMenu(menuName, 'Non-Veg');
    console.log('Created menu, now checking DOM');
    await page.waitForTimeout(2000);
    const menuCount = await page.locator(`text=${menuName}`).count();
    console.log('text count', menuCount);
    const headings = await page.locator('h1, h2, h3, h4').allTextContents();
    console.log('headings count', headings.length);
    console.log('headings sample', headings.slice(0, 20));
    const cards = await page.locator(`div:has-text("${menuName}")`).count();
    console.log('cards count', cards);
    const rows = await page.locator('table tbody tr').count();
    console.log('table rows count', rows);
    const menuRow = await page.locator('table tbody tr', { hasText: menuName }).count();
    console.log('menu row count', menuRow);
    const optionCount = await page.locator('[role="option"]').count();
    console.log('role option count', optionCount);
  } catch (err) {
    console.error(err);
  } finally {
    console.log('done');
    await browser.close();
  }
})();