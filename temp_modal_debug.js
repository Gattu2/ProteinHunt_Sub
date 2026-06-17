const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ baseURL: 'https://testsub.proteinhunt.in' });
  try {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.fill('input[name="username"], input[placeholder*="Username"], input[placeholder*="username"], input[type="text"]', 'hemanthnalla1@gmail.com');
    await page.fill('input[type="password"]', 'Rgukt@123');
    await page.click('button:has-text("Sign in"), button:has-text("Sign In"), button:has-text("Login"), button:has-text("Log in"), button:has-text("Submit")');
    await page.waitForURL(/dashboard|admin|users/, { timeout: 30000 });
    await page.waitForTimeout(10000);
    const addLocator = page.locator('text=/add subscriber/i, text=/add/i, text=/subscriber/i').first();
    console.log('Add locator count:', await addLocator.count());
    if (await addLocator.count() > 0) {
      console.log('Add locator text:', await addLocator.textContent());
      console.log('Add locator outerHTML:', await addLocator.evaluate((el) => el.outerHTML));
    }
    const addButtonSelector = 'button, a, [role="button"], div';
    const addCandidates = await page.locator(addButtonSelector).filter({ hasText: /add subscriber|add/i }).all();
    console.log('Add candidates count:', addCandidates.length);
    for (let i = 0; i < addCandidates.length; i++) {
      console.log(`candidate ${i} text=${await addCandidates[i].textContent()}`);
      console.log(await addCandidates[i].evaluate((el) => el.outerHTML));
    }
    await page.click('text=/add subscriber/i, text=/add/i');
    await page.waitForSelector('text=Create New Subscriber', { timeout: 20000 });
    await page.screenshot({ path: 'temp_add_subscriber_modal_debug.png', fullPage: true });
    const dialog = page.getByRole('dialog', { name: /create new subscriber/i }).first();
    console.log('Dialog count:', await dialog.count());
    console.log('Dialog aria role name:', await dialog.evaluate((el) => el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || 'none'));
    const visibleInputs = await page.locator('input, select, textarea, div[role="combobox"], div[role="textbox"]').filter({ has: dialog }).all();
    console.log('Visible form control count:', visibleInputs.length);
    for (let i = 0; i < visibleInputs.length; i++) {
      const el = visibleInputs[i];
      const name = await el.evaluate((node) => node.getAttribute('name') || node.getAttribute('aria-label') || node.getAttribute('placeholder') || node.getAttribute('id') || node.tagName);
      const type = await el.evaluate((node) => node.getAttribute('type') || node.getAttribute('role') || node.tagName.toLowerCase());
      const outer = await el.evaluate((node) => node.outerHTML.slice(0, 300));
      console.log(`control ${i}: name=${name} type=${type} html=${outer}`);
    }
    const labels = await page.locator('label, div, span').filter({ hasText: /Phone|Menu|Weekly|Total Meals|Delivery/i }).all();
    console.log('Relevant labels count:', labels.length);
    for (let i = 0; i < labels.length; i++) {
      const el = labels[i];
      const text = await el.textContent();
      const outer = await el.evaluate((node) => node.outerHTML.slice(0, 300));
      console.log(`label ${i}: text=${text?.trim()} html=${outer}`);
    }
    const a11y = await page.accessibility.snapshot();
    console.log('A11y snapshot root name:', a11y.name);
    const findText = (node, regex) => {
      const matches = [];
      if (node.name && regex.test(node.name)) matches.push({role: node.role, name: node.name, value: node.value});
      if (node.children) node.children.forEach((child) => matches.push(...findText(child, regex)));
      return matches;
    };
    console.log('A11y matches for Phone:', findText(a11y, /phone/i));
    console.log('A11y matches for Menu:', findText(a11y, /menu/i));
    console.log('A11y matches for Total Meals:', findText(a11y, /total meals/i));
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
})();