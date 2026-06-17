const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ baseURL: 'https://testsub.proteinhunt.in' });
  try {
    await page.goto('/login', { waitUntil: 'load', timeout: 30000 });
    await page.fill('input[name="username"], input[placeholder*="username"], input[type="text"]', 'hemanthnalla1@gmail.com');
    await page.fill('input[type="password"]', 'Rgukt@123');
    await page.click('button:has-text("Sign in"), button:has-text("Sign In"), button:has-text("Login"), button:has-text("Log in")');
    await page.waitForURL(/dashboard|admin|users/, { timeout: 30000 });
    console.log('After login URL:', page.url());
    const subscriberButtonCount = await page.locator('a:has-text("Subscribers"), button:has-text("Subscribers")').count();
    console.log('Subscribers button count:', subscriberButtonCount);
    for (let i = 0; i < Math.min(20, subscriberButtonCount); i++) {
      console.log('Subscribers locator', i, await page.locator('a:has-text("Subscribers"), button:has-text("Subscribers")').nth(i).textContent());
    }
    await page.click('a:has-text("Subscribers"), button:has-text("Subscribers")');
    await page.waitForURL(/users/, { timeout: 30000 });
    console.log('Reached URL after clicking Subscribers:', page.url());
    const buttonTexts = await page.locator('button').allTextContents();
    console.log('All button texts:', buttonTexts.slice(0, 50));
    const pageText = await page.locator('body').innerText();
    console.log('Page text sample:', pageText.slice(0, 1500));
    await page.click('button:has-text("Add Subscriber")');
    await page.waitForSelector('text=Create New Subscriber', { timeout: 15000 });
    await page.screenshot({ path: 'temp_add_subscriber_page.png', fullPage: true });
    const modal = await page.locator('div:has-text("Create New Subscriber")').first();
    const html = await modal.innerHTML();
    console.log(html);
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
})();
