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
    const label = page.locator('label[for="phoneNumber"]');
    console.log('label count', await label.count());
    console.log('label outerHTML', await label.evaluate((el) => el.outerHTML));
    console.log('label text', await label.textContent());
    const phoneInput = page.locator('#phoneNumber');
    console.log('phone input count', await phoneInput.count());
    console.log('phone input outerHTML', await phoneInput.evaluate((el) => el.outerHTML));
    console.log('phone input visible', await phoneInput.isVisible());
    console.log('phone input enabled', await phoneInput.isEnabled());
    const phoneParent = phoneInput.locator('..');
    console.log('phone parent outerHTML', await phoneParent.evaluate((el) => el.outerHTML.slice(0, 400)));
    const phoneAnc = phoneInput.locator('xpath=ancestor::div[1]');
    console.log('phone ancestor div outerHTML', await phoneAnc.evaluate((el) => el.outerHTML.slice(0, 400)));
    const hiddenCheckboxes = await page.locator('input[type="checkbox"]').count();
    console.log('checkbox count in dialog', hiddenCheckboxes);
    const phoneDivs = await page.locator('div:has-text("Phone Number")').all();
    console.log('div has-text Phone Number count', phoneDivs.length);
    for (let i = 0; i < phoneDivs.length; i++) {
      const el = phoneDivs.nth(i);
      console.log('PhoneNumber div', i, await el.evaluate((node) => node.outerHTML.slice(0, 800)));
    }
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();