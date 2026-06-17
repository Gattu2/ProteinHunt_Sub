const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ baseURL: 'https://testsub.proteinhunt.in' });
  try {
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 60000 });
    await page.fill('input[name="username"], input[placeholder*="Username"], input[placeholder*="username"], input[type="text"]', 'hemanthnalla1@gmail.com');
    await page.fill('input[type="password"]', 'Rgukt@123');
    await page.click('button:has-text("Sign in"), button:has-text("Sign In"), button:has-text("Login"), button:has-text("Log in"), button:has-text("Submit")');
    await page.waitForURL(/dashboard|admin|users/, { timeout: 60000 });
    await page.click('a:has-text("Subscribers"), button:has-text("Subscribers")');
    await page.waitForURL(/\/admin\/users/, { timeout: 60000 });
    await page.waitForSelector('text=/subscribers/i', { timeout: 60000 });
    await page.waitForTimeout(10000);
    const bodyText = await page.locator('body').innerText();
    console.log('BODY TEXT SAMPLE:\n', bodyText.slice(0, 8000));
    const nodes = await page.evaluate(() => {
      const results = [];
      const tags = ['button', 'a', 'div', 'span', 'label', 'input', 'select', 'textarea'];
      document.querySelectorAll(tags.join(',')).forEach((el, idx) => {
        const text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120);
        const aria = el.getAttribute('aria-label') || '';
        const title = el.getAttribute('title') || '';
        const placeholder = el.getAttribute('placeholder') || '';
        const role = el.getAttribute('role') || ''; 
        if (/add subscriber|add|subscriber|phone number|menu type|weekly menu|total meals|delivery days|delivery slots/i.test(text + ' ' + aria + ' ' + title + ' ' + placeholder + ' ' + role)) {
          results.push({
            tag: el.tagName.toLowerCase(),
            text,
            aria,
            title,
            placeholder,
            role,
            class: el.className,
            html: el.outerHTML.slice(0, 400),
          });
        }
      });
      return results;
    });
    console.log('MATCHED ELEMENTS:', nodes.length);
    nodes.forEach((node, i) => {
      console.log(`--- node ${i} ---`);
      console.log(JSON.stringify(node, null, 2));
    });
    const phoneLabels = await page.locator('label:has-text("Phone Number"), div:has-text("Phone Number"), span:has-text("Phone Number")').all();
    console.log('phone label count:', phoneLabels.length);
    for (let i = 0; i < phoneLabels.length; i++) {
      const label = phoneLabels[i];
      console.log('--- phone label', i, '---');
      console.log('text:', await label.textContent());
      console.log('outerHTML:', await label.evaluate((el) => el.outerHTML));
      const inputs = await label.locator('input, select, textarea').all();
      console.log('input child count:', inputs.length);
      for (let j = 0; j < inputs.length; j++) {
        const input = inputs[j];
        console.log('child', j, 'type:', await input.evaluate((el) => el.type || el.getAttribute('role') || el.tagName), 'aria-label:', await input.getAttribute('aria-label'), 'placeholder:', await input.getAttribute('placeholder'), 'outer:', await input.evaluate((el) => el.outerHTML));
      }
      const parentInputs = await label.locator('..').locator('input, select, textarea').all();
      console.log('parent inputs count:', parentInputs.length);
      for (let j = 0; j < parentInputs.length; j++) {
        const input = parentInputs[j];
        console.log('parent child', j, 'type:', await input.evaluate((el) => el.type || el.getAttribute('role') || el.tagName), 'aria-label:', await input.getAttribute('aria-label'), 'placeholder:', await input.getAttribute('placeholder'), 'outer:', await input.evaluate((el) => el.outerHTML));
      }
    }
    await page.screenshot({ path: 'temp_modal_debug2.png', fullPage: true });
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
})();