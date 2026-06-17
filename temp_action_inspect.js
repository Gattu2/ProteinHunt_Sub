const { chromium } = require('playwright');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/Admin_Pages/DashboardPage');
const { SubscribersPage } = require('./pages/Admin_Pages/SubscribersPage');
const users = require('./test-data/users');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ baseURL: 'https://testsub.proteinhunt.in' });
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const subscribersPage = new SubscribersPage(page);
  await loginPage.goto();
  await loginPage.loginWithEmail(users.admin.email, users.admin.password);
  await loginPage.verifyLoginSuccess();
  await dashboardPage.verifyLoaded();
  const dashboardText = await page.locator('body').innerText();
  const mealsMatches = dashboardText.match(/[^\n]*meal[^\n]*/gi) || [];
  console.log('Dashboard meal-related text matches:', mealsMatches.slice(0, 20));
  await dashboardPage.navigateToSubscribers();
  await subscribersPage.verifyLoaded();
  const row = await page.locator('table tbody tr').first();
  console.log('Row text:', await row.innerText());
  const actionCell = await row.locator('td').last();
  console.log('Action cell text:', await actionCell.innerText());
  const buttonLocator = actionCell.locator('button');
  const buttonCount = await buttonLocator.count();
  console.log('Button count:', buttonCount);
  for (let i = 0; i < buttonCount; i++) {
    const b = buttonLocator.nth(i);
    const title = await b.getAttribute('title');
    console.log(`Button[${i}] title: ${title}`);
  }

  // Click View address
  const addressButton = actionCell.locator('button[title="View address"]').first();
  if (await addressButton.count() > 0) {
    console.log('Clicking View address button');
    await addressButton.click();
    await page.waitForTimeout(2000);
    console.log('After address click URL:', page.url());
    const dialogCount = await page.locator('[role="dialog"]').count();
    console.log('Dialog count after address click:', dialogCount);
    if (dialogCount > 0) {
      console.log('Address dialog text:', await page.locator('[role="dialog"]').first().innerText().then((t) => t.slice(0, 1000)).catch(() => '<no dialog>'));
    }
    console.log('Body snapshot after address click:', await page.locator('body').innerText().then((t) => t.slice(0, 1000)).catch(() => '<no body>'));
    await page.goto('https://testsub.proteinhunt.in/admin/users');
    await page.waitForTimeout(2000);
  }

  // Click Share credentials via WhatsApp
  const shareButton = actionCell.locator('button[title="Share credentials via WhatsApp"]').first();
  if (await shareButton.count() > 0) {
    console.log('Clicking Share via WhatsApp button');
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      shareButton.click(),
    ]).catch((err) => [null]);
    if (newPage) {
      await newPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
      console.log('New page URL:', newPage.url());
      console.log('New page title:', await newPage.title());
      await newPage.close();
    } else {
      console.log('Share button did not open a new page');
    }
  }

  // Click Edit subscriber
  const editButton = actionCell.locator('button[title="Edit subscriber"]').first();
  if (await editButton.count() > 0) {
    console.log('Clicking Edit subscriber button');
    const [editPage] = await Promise.all([
      context.waitForEvent('page').catch(() => null),
      editButton.click(),
    ]);
    if (editPage) {
      await editPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
      console.log('Edit opened in new page URL:', editPage.url());
      console.log('Edit page title:', await editPage.title());
      console.log('Edit page body snippet:', await editPage.locator('body').innerText().then((t) => t.slice(0, 1000)).catch(() => '<no body>'));
      await editPage.close();
    } else {
      await page.waitForTimeout(2000);
      const dialogCount = await page.locator('[role="dialog"]').count();
      console.log('Edit dialog count:', dialogCount);
      if (dialogCount > 0) {
        const editDialog = page.locator('[role="dialog"]').first();
        console.log('Edit dialog content:', await editDialog.innerText().then((t) => t.slice(0, 1000)).catch(() => '<no dialog>'));
        const editLabels = await editDialog.locator('label, legend, h1, h2, h3, span').allTextContents();
        console.log('Edit dialog labels/title snippets:', editLabels.slice(0, 20));
        const textareaCount = await editDialog.locator('textarea').count();
        console.log('Edit dialog textarea count:', textareaCount);
        if (textareaCount > 0) {
          const areas = await editDialog.locator('textarea').evaluateAll((els) => els.map((el) => ({ placeholder: el.placeholder, id: el.id, name: el.name, value: el.value })));
          console.log('Edit dialog textarea info:', areas);
        }
        const dialogButtons = await editDialog.locator('button').allTextContents();
        console.log('Edit dialog buttons:', dialogButtons);
        const closeButton = editDialog.locator('button:has-text("Close")').first();
        if (await closeButton.count() > 0) {
          await closeButton.click();
          await page.waitForTimeout(1000);
          console.log('Closed edit dialog');
        }
      } else {
        console.log('No new edit page or dialog detected after clicking edit');
      }
    }
  }

  // Click Add meals
  const addMealButton = actionCell.locator('button[title="Add meals"]').first();
  if (await addMealButton.count() > 0) {
    console.log('Clicking Add meals button');
    const [mealPage] = await Promise.all([
      context.waitForEvent('page').catch(() => null),
      addMealButton.click(),
    ]);
    if (mealPage) {
      await mealPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
      console.log('Add meal opened in new page URL:', mealPage.url());
      console.log('Add meal page title:', await mealPage.title());
      console.log('Add meal page body snippet:', await mealPage.locator('body').innerText().then((t) => t.slice(0, 1000)).catch(() => '<no body>'));
      await mealPage.close();
    } else {
      await page.waitForTimeout(2000);
      const dialogCount = await page.locator('[role="dialog"]').count();
      console.log('Add meal dialog count:', dialogCount);
      if (dialogCount > 0) {
        const mealDialog = page.locator('[role="dialog"]').first();
        console.log('Add meal dialog content:', await mealDialog.innerText().then((t) => t.slice(0, 1000)).catch(() => '<no dialog>'));
        const mealLabels = await mealDialog.locator('label, legend, h1, h2, h3, span').allTextContents();
        console.log('Add meal dialog labels/title snippets:', mealLabels.slice(0, 20));
        const inputs = mealDialog.locator('input, textarea, select');
        console.log('Add meal dialog element count:', await inputs.count());
        for (let j = 0; j < await inputs.count(); j++) {
          const el = inputs.nth(j);
          console.log(`Add meal element[${j}]: type=${await el.getAttribute('type')} id=${await el.getAttribute('id')} name=${await el.getAttribute('name')} placeholder=${await el.getAttribute('placeholder')} value=${await el.evaluate((e) => e.value).catch(() => '<no value>')}`);
        }
      } else {
        console.log('No new add meal page or dialog detected after clicking add meal');
      }
    }
  }

  await browser.close();
})();