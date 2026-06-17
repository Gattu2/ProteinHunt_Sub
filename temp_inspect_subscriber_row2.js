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
  await page.waitForSelector('table tbody tr', { timeout: 30000 });
  const row = await page.$('table tbody tr');
  if (!row) {
    console.log('NO_ROW');
    await browser.close();
    return;
  }
  const cells = await row.$$('td');
  for (let i = 0; i < Math.min(3, cells.length); i++) {
    await cells[i].click();
    const dialog = await page.waitForSelector('[role=dialog]', { timeout: 3000 }).catch(() => null);
    console.log('CELL', i, 'DIALOG', !!dialog);
    if (dialog) {
      console.log('DIALOG_TEXT', (await dialog.innerText()).slice(0, 200));
      break;
    }
  }
  await browser.close();
})();