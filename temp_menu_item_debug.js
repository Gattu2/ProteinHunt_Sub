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
    const dialogButton = await page.locator('button:has-text("Add")').first();
    console.log('Add button count', await dialogButton.count());
    await dialogButton.click();
    const dialog = page.locator('[role="dialog"]').first();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    console.log('Dialog text:', await dialog.innerText());
    console.log('Dialog HTML snippet:', (await dialog.innerHTML()).slice(0, 5000));
    const fields = await dialog.locator('label, input, textarea, select, [role="combobox"]').all();
    console.log('Fields count', fields.length);
    for (let i = 0; i < fields.length; i++) {
      try {
        const element = fields[i];
        const tag = await element.evaluate((el) => el.tagName);
        const text = await element.evaluate((el) => el.textContent?.trim());
        const attrs = await element.evaluate((el) => {
          const a = {};
          for (const attr of el.getAttributeNames()) a[attr] = el.getAttribute(attr);
          return a;
        });
        console.log(`FIELD ${i}: ${tag} ${text || ''} ${JSON.stringify(attrs)}`);
      } catch (err) {
        console.error('Field eval error', err);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();