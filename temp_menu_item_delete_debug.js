const { chromium } = require('playwright');
const { LoginPage } = require('./pages/LoginPage');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ baseURL: 'https://testsub.proteinhunt.in' });
  try {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithEmail('hemanthnalla1@gmail.com', 'Rgukt@123');
    await loginPage.verifyLoginSuccess();
    await page.goto('/admin/menu');
    await page.waitForSelector('h1:has-text("Menu Items")', { timeout: 30000 });
    const itemName = `Debug Delete Item ${Date.now()}`;
    console.log('Creating item', itemName);
    await page.click('button:has-text("Add Menu Item")');
    await page.waitForSelector('[role="dialog"]', { timeout: 15000 });
    const dialog = page.locator('[role="dialog"]').first();
    await dialog.locator('label:has-text("Name")').locator('..').locator('input').fill(itemName);
    await dialog.locator('label:has-text("Description")').locator('..').locator('textarea').fill('test delete');
    await dialog.locator('label:has-text("Calories")').locator('..').locator('input').fill('100');
    await dialog.locator('label:has-text("Protein")').locator('..').locator('input').fill('10');
    await dialog.locator('label:has-text("Carbs")').locator('..').locator('input').fill('10');
    await dialog.locator('label:has-text("Fat")').locator('..').locator('input').fill('10');
    await dialog.locator('label:has-text("Ingredients")').locator('..').locator('textarea').fill('test');
    await dialog.locator('label:has-text("Menu Type")').locator('..').locator('[role="combobox"]').click();
    await page.locator('[role="option"]', { hasText: 'Non-Veg' }).click();
    await dialog.locator('button:has-text("Save"), button:has-text("Create"), button:has-text("Add")').first().click();
    await page.waitForTimeout(2000);
    const card = page.locator(`div.rounded-2xl:has(h3:has-text("${itemName}"))`).first();
    console.log('Card count', await card.count());
    if (await card.count() === 0) {
      console.log('No card found');
      return;
    }
    const cardHtml = await card.evaluate((el) => el.outerHTML);
    console.log('Card html snippet:', cardHtml.slice(0, 1000));
    const buttons = card.locator('button');
    console.log('Button count in card', await buttons.count());
    for (let i = 0; i < await buttons.count(); i++) {
      const btn = buttons.nth(i);
      const text = (await btn.textContent())?.trim().replace(/\s+/g, ' ') || '';
      const ariaLabel = await btn.getAttribute('aria-label');
      const title = await btn.getAttribute('title');
      const outer = await btn.evaluate((el) => el.outerHTML);
      console.log(`button ${i}: text='${text}' ariaLabel='${ariaLabel}' title='${title}' html='${outer.slice(0,200)}'`);
    }
    const deleteButton = card.locator('button:has(svg.lucide-trash), button:has(svg.lucide-trash-2), button:has(svg[class*="trash"])').first();
    console.log('Delete selector count', await deleteButton.count());
    if (await deleteButton.count() === 0) {
      const alt = card.locator('button:has-text("Delete"), button:has-text("Remove")').first();
      console.log('Alt delete count', await alt.count());
      if (await alt.count() > 0) {
        console.log('Alt delete outer html', (await alt.evaluate((el) => el.outerHTML)).slice(0,200));
      }
    }
    if (await deleteButton.count() > 0) {
      console.log('Clicking delete button');
      await deleteButton.click();
      await page.waitForTimeout(2000);
      const confirmCount = await page.locator('[role="dialog"] button:has-text("Delete"), [role="dialog"] button:has-text("Confirm"), [role="dialog"] button:has-text("Yes"), [role="dialog"] button:has-text("Ok")').count();
      console.log('Confirm buttons found', confirmCount);
      if (confirmCount > 0) {
        await page.locator('[role="dialog"] button:has-text("Delete"), [role="dialog"] button:has-text("Confirm"), [role="dialog"] button:has-text("Yes"), [role="dialog"] button:has-text("Ok")').first().click();
      }
      await page.waitForTimeout(2000);
      const remaining = await page.locator(`div.rounded-2xl:has(h3:has-text("${itemName}"))`).count();
      console.log('Remaining after delete', remaining);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();