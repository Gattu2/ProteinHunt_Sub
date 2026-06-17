const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://testsub.proteinhunt.in/login', { waitUntil: 'networkidle' });
  const formHtml = await page.locator('form').first().innerHTML();
  console.log(formHtml);
  console.log('---');
  const inputs = await page.locator('input').evaluateAll(nodes => nodes.map(n => ({ type: n.type, placeholder: n.placeholder, id: n.id, name: n.name, class: n.className }))); 
  console.log(JSON.stringify(inputs, null, 2));
  await browser.close();
})();
