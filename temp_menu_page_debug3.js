const { chromium } = require('playwright');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/Admin_Pages/DashboardPage');
const { MenuPage } = require('./pages/Admin_Pages/MenuPage');
(async () => {
  const browser = await chromium.launch({ headless: true });
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
    const menuName = `Debug Veg & Egg Menu ${Date.now()}`;
    await menuPage.openCreateMenuDialog();
    await page.getByLabel(/menu name|name/i).first().fill(menuName);
    const menuTypeSelect = page.locator('label:has-text("Menu Type")').locator('..').locator('[role="combobox"]').first();
    await menuTypeSelect.click();
    await page.locator('[role="option"]', { hasText: 'Veg & Egg' }).first().click();
    await page.getByRole('button', { name: /save|create|add/i }).first().click();
    await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(2000);
    const regex = new RegExp(`^${menuName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\&/g, '(?:&|&amp;)').replace(/\s+/g, '\\s+')}$`, 'i');
    const locator = page.locator('h3', { hasText: regex });
    console.log('matching h3 count', await locator.count());
    for (let i = 0; i < await locator.count(); i++) {
      const el = locator.nth(i);
      console.log('visibility', await el.isVisible(), 'text', await el.textContent());
      console.log('outerHTML', (await el.evaluate(node => node.outerHTML)).slice(0, 300));
    }
    const h3s = await page.locator('h3').allTextContents();
    console.log('all h3s', h3s.slice(-20));
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
})();