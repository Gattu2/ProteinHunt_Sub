const { chromium } = require('playwright');
const users = require('./test-data/users');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ baseURL: 'https://testsub.proteinhunt.in' });
  try {
    await page.goto('/login');
    await page.fill('[placeholder="Enter your username"]', users.admin.email);
    await page.fill('[placeholder="Enter your password"]', users.admin.password);
    await Promise.all([
      page.waitForURL('**/admin', { timeout: 30000 }),
      page.click('button:has-text("Sign In"), button:has-text("Login")'),
    ]);
    await page.waitForSelector('a:has-text("Menu Items")', { timeout: 30000 });
    await Promise.all([
      page.waitForURL('**/admin/menu', { timeout: 30000 }),
      page.click('a:has-text("Menu Items")'),
    ]);
    await page.waitForLoadState('networkidle');

    const targetName = 'Chicken Curry DEBUG DELETE';
    const item = { menuType: 'Non-Veg', name: targetName, description: 'Delete debug item', calories: 123, protein: 12, carbs: 34, fat: 5, ingredients: 'Test' };

    console.log('Adding debug item');
    await page.click('button:has-text("Add Menu Item")');
    await page.waitForSelector('[role="dialog"]', { timeout: 15000 });
    const dialog = page.locator('[role="dialog"]').first();
    await dialog.locator('label:has-text("Name")').locator('..').locator('input').fill(item.name);
    await dialog.locator('label:has-text("Description")').locator('..').locator('textarea').fill(item.description);
    await dialog.locator('label:has-text("Calories")').locator('..').locator('input').fill(item.calories.toString());
    await dialog.locator('label:has-text("Protein")').locator('..').locator('input').fill(item.protein.toString());
    await dialog.locator('label:has-text("Carbs")').locator('..').locator('input').fill(item.carbs.toString());
    await dialog.locator('label:has-text("Fat")').locator('..').locator('input').fill(item.fat.toString());
    await dialog.locator('label:has-text("Ingredients")').locator('..').locator('textarea').fill(item.ingredients);
    await dialog.locator('[role="combobox"]').click();
    await page.locator('[role="option"]', { hasText: item.menuType }).click();
    await page.click('button:has-text("Save"), button:has-text("Create"), button:has-text("Add")');
    await page.waitForTimeout(2000);

    console.log('Searching for debug item card');
    const card = page.locator(`div:has(h3:has-text("${targetName}"))`).first();
    console.log('card count', await card.count());
    if (await card.count() === 0) {
      console.log('No debug card found after add');
      await browser.close();
      return;
    }
    console.log('debug card outerHTML', await card.evaluate(el => el.outerHTML));

    const deleteButton = card.locator('button:has(svg.lucide-trash2), button:has(svg.lucide-trash)').first();
    console.log('delete button count', await deleteButton.count());
    if (await deleteButton.count() === 0) {
      console.log('No svg delete button found, trying any button with empty text');
      const buttons = card.locator('button').all();
      for (let i = 0; i < await buttons.length; i++) {
        const btn = buttons[i];
        console.log('button', i, JSON.stringify((await btn.textContent()).trim()), await btn.evaluate(el => el.outerHTML));
      }
    }

    console.log('Clicking delete button');
    await deleteButton.click();
    await page.waitForTimeout(2000);

    const dialogExists = await page.locator('[role="dialog"]').count();
    console.log('dialog count after delete click', dialogExists);
    if (dialogExists > 0) {
      console.log('dialog type html', await page.locator('[role="dialog"]').first().evaluate(el => el.outerHTML));
      const confirm = page.locator('button:has-text("Delete"), button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Ok")').first();
      console.log('confirm button count', await confirm.count());
      if (await confirm.count() > 0) {
        console.log('confirm html', await confirm.evaluate(el => el.outerHTML));
        await confirm.click();
      }
    }
    await page.waitForTimeout(2000);
    const stillThere = await page.locator(`div:has(h3:has-text("${targetName}"))`).count();
    console.log('stillThere after delete', stillThere);
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
