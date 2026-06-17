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
    console.log('URL after login:', page.url());
    await page.click('a:has-text("Subscribers"), button:has-text("Subscribers")');
    await page.waitForURL(/\/admin\/users/, { timeout: 30000 });
    console.log('URL after clicking Subscribers:', page.url());
    const navText = await page.locator('nav, header, main').allTextContents();
    console.log('Nav/main text sample:', navText.slice(0, 10));
    const addCandidates = await page.locator('text=/Add/i').allTextContents();
    console.log('Add text candidates count:', addCandidates.length);
    console.log(addCandidates.slice(0, 50));
    const subscriberCandidates = await page.locator('text=/Subscriber/i').allTextContents();
    console.log('Subscriber text candidates count:', subscriberCandidates.length);
    console.log(subscriberCandidates.slice(0, 50));
    const buttons = await page.locator('button, a, [role="button"]').allTextContents();
    console.log('Buttons count:', buttons.length);
    console.log(buttons.slice(0, 80));
    const addNodes = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*')).filter(el => {
        const text = el.textContent || '';
        return /Add Subscriber|Add|Subscriber|Create New Subscriber|Phone Number|Menu Type|Weekly Menu|Total Meals Purchased|Delivery Days|Delivery Slots/i.test(text);
      }).map(el => ({
        tag: el.tagName.toLowerCase(),
        role: el.getAttribute('role'),
        type: el.getAttribute('type'),
        text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 120),
        class: el.getAttribute('class'),
        id: el.id,
      })).slice(0, 200);
    });
    console.log('Matched element count:', addNodes.length);
    console.dir(addNodes, { depth: 4, maxArrayLength: 200 });
    await page.screenshot({ path: 'temp_admin_users_page.png', fullPage: true });
    const addButtonExists = await page.locator('text=Add Subscriber').count();
    console.log('text=Add Subscriber count:', addButtonExists);
    const addByRole = await page.locator('button:has-text("Add Subscriber"), [role="button"]:has-text("Add Subscriber")').count();
    console.log('button add subscriber count:', addByRole);
    const addByAria = await page.locator('[aria-label*="Add Subscriber"], [aria-label*="add subscriber"]').count();
    console.log('aria-label add subscriber count:', addByAria);
    const addByClass = await page.locator('[class*="add"], [class*="Add"], [class*="subscriber"], [class*="Subscriber"]').count();
    console.log('class-based add/subscriber count:', addByClass);
    await page.click('text=Add Subscriber');
    await page.waitForSelector('text=Create New Subscriber', { timeout: 20000 });
    console.log('Add Subscriber dialog present');
    const dialogText = await page.locator('text=Create New Subscriber').first().textContent();
    console.log('Dialog text:', dialogText);
    await page.screenshot({ path: 'temp_add_subscriber_modal.png', fullPage: false });
    const modal = await page.locator('div:has-text("Create New Subscriber")').first();
    const html = await modal.innerHTML();
    console.log('Modal HTML:\n', html);
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
})();