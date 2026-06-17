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
    console.log('Page url after subscribers:', page.url());
    console.log('Add Subscriber exists:', await subscribersPage.addSubscriberButton.count());
    console.log('Add Subscriber outerHTML:', await subscribersPage.addSubscriberButton.evaluate((el) => el.outerHTML));
    await subscribersPage.openAddSubscriberModal();
    console.log('Opened modal. Dialog count:', await subscribersPage.dialog.count());
    await subscribersPage.verifyAddSubscriberModal();
    const phoneSections = await page.locator('div:has-text("Phone Number")').all();
    console.log('phone sections count:', await phoneSections.length);
    for (let i = 0; i < phoneSections.length; i++) {
      const section = phoneSections.nth(i);
      console.log('section', i, await section.evaluate((el) => el.outerHTML));
      const inputs = await section.locator('input, select, textarea').all();
      console.log('input count:', inputs.length);
      for (let j = 0; j < inputs.length; j++) {
        const input = inputs[j];
        console.log('input', j, await input.evaluate((el) => ({ tag: el.tagName, type: el.type, role: el.getAttribute('role'), aria: el.getAttribute('aria-label'), outer: el.outerHTML.slice(0, 400) })));
      }
    }
    const label = await page.locator('label:has-text("Phone Number")').first();
    if (await label.count() > 0) {
      console.log('phone label outerHTML:', await label.evaluate((el) => el.outerHTML));
      const parent = await label.locator('..').first();
      console.log('parent outerHTML:', await parent.evaluate((el) => el.outerHTML.slice(0, 400)));
      const siblingInputs = await parent.locator('input, select, textarea').all();
      console.log('sibling inputs count:', siblingInputs.length);
      for (let i = 0; i < siblingInputs.length; i++) {
        const input = siblingInputs[i];
        console.log('sibling', i, await input.evaluate((el) => ({ tag: el.tagName, type: el.type, role: el.getAttribute('role'), aria: el.getAttribute('aria-label'), placeholder: el.getAttribute('placeholder'), outer: el.outerHTML.slice(0, 400) })));
      }
    } else {
      console.log('No phone label found');
    }
    await page.screenshot({ path: 'temp_use_page_object.png', fullPage: true });
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
})();