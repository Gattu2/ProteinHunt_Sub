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
    const section = page.locator('div.border.border-gray-200.rounded-lg.p-4.space-y-3', { hasText: /breakfast/i }).first();
    console.log('section count', await page.locator('div.border.border-gray-200.rounded-lg.p-4.space-y-3', { hasText: /breakfast/i }).count());
    console.log('section visible', await section.isVisible());
    const rows = section.locator('div.flex.items-center.justify-between');
    console.log('row count', await rows.count());
    for (let i = 0; i < await rows.count(); i++) {
      const row = rows.nth(i);
      console.log('row', i, 'text', await row.textContent());
      const button = row.locator('button[role="combobox"]').first();
      console.log(' row button count', await row.locator('button[role="combobox"]').count(), 'visible', await button.isVisible().catch(() => 'err'));
    }
    const info = await page.evaluate(() => {
      const result = {};
      result.timeSlotLabel = Array.from(document.querySelectorAll('label')).filter((el) => el.textContent && el.textContent.includes('Time Slot Mapping')).map((el) => ({ tag: el.tagName, text: el.textContent.trim(), outer: el.outerHTML.slice(0, 500) }));
      result.timeSlotSections = Array.from(document.querySelectorAll('div.border.border-gray-200.rounded-lg.p-4.space-y-3')).map((el) => ({ text: el.textContent.trim().slice(0, 500), outer: el.outerHTML.slice(0, 800) }));
      result.comboboxes = Array.from(document.querySelectorAll('button[role="combobox"]')).map((el) => ({ text: el.textContent.trim(), outer: el.outerHTML.slice(0, 500), ariaControls: el.getAttribute('aria-controls'), ariaExpanded: el.getAttribute('aria-expanded') }));
      result.timeSlotRows = Array.from(document.querySelectorAll('div.border.border-gray-200.rounded-lg.p-4.space-y-3 div.flex.items-center.justify-between')).map((el) => ({ text: el.textContent.trim(), outer: el.outerHTML.slice(0, 800) }));
      return result;
    });
    console.log('timeSlotInfo', JSON.stringify(info, null, 2));
    await page.screenshot({ path: 'temp_delivery_debug.png', fullPage: true });
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();