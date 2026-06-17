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

    const itemName = `DebugUpdateItem ${Date.now()}`;
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

    const vegTab = page.locator('button', { hasText: /Veg(?! & Egg)/i }).first();
    await vegTab.click();
    await page.waitForTimeout(2000);

    const itemCard = page.locator('div:has(h3:has-text("' + itemName + '"))').first();
    console.log('card count', await itemCard.count());
    if (await itemCard.count() === 0) {
      console.log('Could not find card');
      console.log('body text includes item?', (await page.locator('body').innerText()).includes(itemName));
      return;
    }
    const cardHtml = await itemCard.evaluate((el) => el.outerHTML);
    console.log('card html snippet', cardHtml.slice(0, 800));
    const buttons = itemCard.locator('button');
    console.log('buttons in card', await buttons.count());
    for (let i = 0; i < await buttons.count(); i++) {
      const btn = buttons.nth(i);
      const text = await btn.textContent();
      const ariaLabel = await btn.getAttribute('aria-label');
      const title = await btn.getAttribute('title');
      const outer = await btn.evaluate((el) => el.outerHTML);
      console.log(`button ${i}: text='${text}' aria-label='${ariaLabel}' title='${title}' outer='${outer.slice(0,200)}'`);
    }
    const editButton = itemCard.getByRole('button', { name: /edit/i }).first();
    console.log('edit button count', await editButton.count());
    if (await editButton.count() === 0) {
      console.log('no accessible edit button by name');
    }

  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();