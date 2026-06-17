const { chromium } = require('playwright');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/Admin_Pages/DashboardPage');
const { SubscribersPage } = require('./pages/Admin_Pages/SubscribersPage');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ baseURL: 'https://testsub.proteinhunt.in' });
  try {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const subscribersPage = new SubscribersPage(page);
    await loginPage.goto();
    await loginPage.loginWithEmail('hemanthnalla1@gmail.com', 'Rgukt@123');
    await loginPage.verifyLoginSuccess();
    await dashboardPage.verifyLoaded();
    await dashboardPage.navigateToSubscribers();
    await subscribersPage.verifyLoaded();
    await subscribersPage.openAddSubscriberModal();
    console.log('dialog count', await subscribersPage.dialog.count());
    const dialogHtml = await subscribersPage.dialog.evaluate((el) => el.outerHTML.slice(0, 1500));
    console.log('dialog outerHTML sample:\n', dialogHtml);
    const labelTexts = ['Full Name', 'Username', 'Password', 'Phone Number', 'Menu Type', 'Weekly Menu', 'Total Meals Purchased', 'Subscription Start Date'];
    for (const text of labelTexts) {
      const locator = page.locator(`label:has-text("${text}"), div:has-text("${text}"), span:has-text("${text}")`).first();
      const count = await locator.count();
      console.log(`\n=== LOCATOR FOR ${text} COUNT: ${count} ===`);
      if (count > 0) {
        console.log(await locator.evaluate((el) => el.outerHTML));
        const enclosing = await locator.locator('..').first();
        console.log('parent outerHTML:', await enclosing.evaluate((el) => el.outerHTML.slice(0, 800)));
      }
    }
    const dialogInputs = await page.locator('div[role="dialog"], dialog, [aria-modal="true"]').first().locator('input, select, textarea, [role="combobox"], [role="textbox"]').all();
    console.log('\nTotal controls in dialog:', dialogInputs.length);
    for (let i = 0; i < dialogInputs.length; i++) {
      const input = dialogInputs[i];
      const info = await input.evaluate((el) => ({
        tag: el.tagName,
        type: el.type || el.getAttribute('role') || el.tagName,
        id: el.id,
        name: el.name,
        ariaLabel: el.getAttribute('aria-label'),
        placeholder: el.getAttribute('placeholder'),
        outer: el.outerHTML.slice(0, 400)
      }));
      console.log('control', i, JSON.stringify(info, null, 2));
    }
    await page.screenshot({ path: 'temp_modal_dump.png', fullPage: true });
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();