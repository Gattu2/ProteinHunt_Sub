const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { LoginPage } = require('./pages/LoginPage');
const { SubscriberDashboardPage } = require('./pages/Subscriber_Pages/SubscriberDashboardPage');
const { MyDeliveriesPage } = require('./pages/Subscriber_Pages/MyDeliveriesPage');
const { SubscriptionPage } = require('./pages/Subscriber_Pages/SubscriptionPage');
const { WeeklyMenuPage } = require('./pages/Subscriber_Pages/WeeklyMenuPage');

(async () => {
  const out = { upcoming: null, history: null, legacy: null, subscription: {}, weekly: {} };
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext({ baseURL: process.env.BASE_URL || 'https://testsub.proteinhunt.in' });
  const page = await context.newPage();
  try {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithUsername('bhavyasri', 'ProteinHunt@123');
    await loginPage.verifyLoginSuccess();

    const dashboard = new SubscriberDashboardPage(page);
    await dashboard.verifyLoaded();

    // My Deliveries
    await dashboard.navigateToMyDeliveries();
    const myDeliveries = new MyDeliveriesPage(page);
    await myDeliveries.verifyLoaded();
    out.upcoming = await myDeliveries.verifyUpcomingSlots();
    // explicit exploration of top-right tab switch (history)
    try {
      const historyTab = page.getByRole('tab', { name: /history/i }).first();
      if ((await historyTab.count()) > 0) {
        await historyTab.click().catch(() => {});
      } else {
        // fallback: look for a switch control / button
        const histBtn = page.locator('button:has-text("History"), .switch [role="tab"]:has-text("History")').first();
        if ((await histBtn.count()) > 0) await histBtn.click().catch(() => {});
      }
    } catch (err) {
      console.log('History tab click error', err.message);
    }
    out.history = await myDeliveries.verifyHistory();
    // Legacy
    try {
      const legacyTab = page.getByRole('tab', { name: /legacy|outside system/i }).first();
      if ((await legacyTab.count()) > 0) await legacyTab.click().catch(() => {});
    } catch (err) {
      console.log('Legacy tab click error', err.message);
    }
    out.legacy = await myDeliveries.verifyLegacy();
    await page.screenshot({ path: 'test-results/explore-myDeliveries.png', fullPage: true }).catch(() => {});

    // Subscription
    await dashboard.navigateToSubscription();
    const subscriptionPage = new SubscriptionPage(page);
    await subscriptionPage.verifyLoaded();
    out.subscription.plan = await subscriptionPage.printPlanDetails();
    out.subscription.usage = await subscriptionPage.printUsageAnalysis();
    out.subscription.schedules = await subscriptionPage.printDeliverySchedules();
    await page.screenshot({ path: 'test-results/explore-subscription.png', fullPage: true }).catch(() => {});

    // Weekly Menu - print table header column and row header
    await dashboard.navigateToWeeklyMenu();
    const weekly = new WeeklyMenuPage(page);
    await weekly.verifyLoaded();

    // Attempt to read table headers and row headers
    try {
      const colHeaders = await page.locator('table.weekly thead th').allTextContents().catch(() => []);
      const rowHeaders = await page.locator('table.weekly tbody tr').allTextContents().catch(() => []);
      out.weekly.colHeaders = colHeaders;
      out.weekly.rowHeadersSample = rowHeaders.slice(0, 10);
    } catch (err) {
      out.weekly.error = err.message;
    }
    await page.screenshot({ path: 'test-results/explore-weekly.png', fullPage: true }).catch(() => {});

    // write output
    const outPath = path.join(process.cwd(), 'test-results', 'subscriber_explore_output.json');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
    console.log('Exploration complete, output saved to', outPath);
  } catch (err) {
    console.error('Exploration failed:', err);
  } finally {
    await browser.close();
  }
})();
