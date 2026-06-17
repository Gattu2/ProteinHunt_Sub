const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://testsub.proteinhunt.in/login');
  await page.fill('[placeholder="Enter your username"]', 'hemanthnalla1@gmail.com');
  await page.fill('[placeholder="Enter your password"]', 'Rgukt@123');
  await page.click('button:has-text("Sign in"), button:has-text("Login")');
  await page.waitForURL(/(dashboard|admin|subscriber|chef)/, { timeout: 30000 });
  await page.click('text=Subscribers');
  await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  console.log('CURRENT_URL', page.url());
  const heading = await page.locator('h1, h2, h3').first().innerText().catch(() => 'NO_HEADING');
  console.log('PAGE_HEADING', heading);
  const tables = await page.$$('table');
  console.log('TABLE_COUNT', tables.length);
  for (let ti = 0; ti < tables.length; ti++) {
    const headers = await tables[ti].$$('thead th');
    const headerTexts = [];
    for (const header of headers) {
      headerTexts.push((await header.innerText()).replace(/\n/g, ' | '));
    }
    console.log(`TABLE ${ti} HEADERS:`, headerTexts.join(' || '));
    const firstRow = await tables[ti].$('tbody tr');
    if (!firstRow) {
      console.log(`TABLE ${ti} NO ROWS`);
      continue;
    }
    console.log(`TABLE ${ti} FIRST ROW:`, (await firstRow.innerText()).replace(/\n/g, ' | '));
    console.log(`TABLE ${ti} FIRST ROW HTML:`, await firstRow.evaluate((node) => node.outerHTML));
  }
  const searchInputs = await page.$$('input[placeholder*=\"Search\"], input[placeholder*=\"search\"]');
  console.log('SEARCH_INPUTS', searchInputs.length);
  for (let i = 0; i < searchInputs.length; i++) {
    console.log('SEARCH_INPUT', i, await searchInputs[i].evaluate((n) => n.outerHTML));
  }
  const headingTexts = await page.$$eval('h1, h2, h3, h4', (els) => els.map((el) => el.innerText.trim()).filter(Boolean));
  console.log('HEADINGS', headingTexts.join(' | '));
  await browser.close();
})();
