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
    await page.waitForTimeout(2000);

    const itemName = `DebugCardItem ${Date.now()}`;
    const addBtn = page.getByRole('button', { name: /Add Menu Item/i }).first();
    await addBtn.click();
    const dialog = page.locator('[role="dialog"]').first();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    await dialog.locator('label:has-text("Name *")').locator('..').locator('input').fill(itemName);
    await dialog.locator('label:has-text("Description")').locator('..').locator('textarea').fill('Debug item desc');
    await dialog.locator('label:has-text("Calories")').locator('..').locator('input').fill('111');
    await dialog.locator('label:has-text("Protein")').locator('..').locator('input').fill('12');
    await dialog.locator('label:has-text("Carbs")').locator('..').locator('input').fill('13');
    await dialog.locator('label:has-text("Fat")').locator('..').locator('input').fill('14');
    await dialog.locator('label:has-text("Ingredients")').locator('..').locator('textarea').fill('debug');
    const menuTypeButton = dialog.locator('label:has-text("Menu Type")').locator('..').locator('[role="combobox"]').first();
    await menuTypeButton.click();
    await page.locator('[role="option"]', { hasText: 'Veg' }).first().click();
    await dialog.getByRole('button', { name: /Create|Save|Add/i }).first().click();
    await page.waitForTimeout(3000);

    const vegTab = page.locator('button', { hasText: /^Veg$/i }).first();
    console.log('vegTab count', await vegTab.count(), 'text', await vegTab.textContent());
    await vegTab.click();
    await page.waitForTimeout(2000);

    const cardCandidates = page.locator('div[class*="border border-gray-200"], div[class*="bg-white/80"]');
    console.log('cardCandidates count', await cardCandidates.count());
    for (let i = 0; i < await cardCandidates.count(); i++) {
      const card = cardCandidates.nth(i);
      const hasItem = await card.locator(`h3:has-text("${itemName}")`).count();
      if (hasItem > 0) {
        console.log('Found item card at index', i);
        const outer = await card.evaluate((el) => el.outerHTML);
        console.log(outer.slice(0, 1200));
        const buttons = card.locator('button');
        console.log('button count', await buttons.count());
        for (let j = 0; j < await buttons.count(); j++) {
          const btn = buttons.nth(j);
          const text = await btn.textContent();
          const ariaLabel = await btn.getAttribute('aria-label');
          const title = await btn.getAttribute('title');
          console.log(`button[${j}] text='${text}' ariaLabel='${ariaLabel}' title='${title}'`);
        }
        break;
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();