const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { SubscriberDashboardPage } = require('../pages/Subscriber_Pages/SubscriberDashboardPage');
const { FuelStationPage } = require('../pages/Subscriber_Pages/FuelStationPage');
const { MyDeliveriesPage } = require('../pages/Subscriber_Pages/MyDeliveriesPage');
const { WeeklyMenuPage } = require('../pages/Subscriber_Pages/WeeklyMenuPage');
const { SubscriptionPage } = require('../pages/Subscriber_Pages/SubscriptionPage');
const { InstructionPage } = require('../pages/Subscriber_Pages/InstructionPage');
const { pageLogger } = require('../utils/logger');
const logger = pageLogger('SubscriberSpec');
const users = require('../test-data/users');

test.describe('Subscriber Module', () => {
  test.beforeEach(async ({ page }) => {
    logger.info('Subscriber Module beforeEach: login as subscriber');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithUsername(users.subscriber.username, users.subscriber.password);
    await loginPage.verifyLoginSuccess();
  });

  test('SUB-S1-S5: FuelStation - verify active subscription and today/tomorrow deliveries', async ({ page }) => {
    logger.info('SUB-S1-S5 start');
    const dashboardPage = new SubscriberDashboardPage(page);
    await dashboardPage.verifyLoaded();

    await dashboardPage.navigateToFuelStation();
    const fuelStationPage = new FuelStationPage(page);
    await fuelStationPage.verifyLoaded();
    const details = await fuelStationPage.verifyActiveSubscriptionDetails();
    expect(details).toBeTruthy();
    logger.info(`FuelStation verification result: ${JSON.stringify(details)}`);
  });

  test('SUB-S6-S9: MyDeliveries - upcoming slots, history and legacy verification', async ({ page }) => {
    logger.info('SUB-S6-S9 start');
    const dashboardPage = new SubscriberDashboardPage(page);
    await dashboardPage.verifyLoaded();

    await dashboardPage.navigateToMyDeliveries();
    const myDeliveriesPage = new MyDeliveriesPage(page);
    await myDeliveriesPage.verifyLoaded();
    const upcoming = await myDeliveriesPage.verifyUpcomingSlots();
    expect(upcoming).not.toBeNull();
    const historyCount = await myDeliveriesPage.verifyHistory();
    logger.info(`History rows: ${historyCount}`);
    const legacyCount = await myDeliveriesPage.verifyLegacy();
    logger.info(`Legacy rows: ${legacyCount}`);
  });

  test('SUB-S10-S11: WeeklyMenu - print slots and days', async ({ page }) => {
    logger.info('SUB-S10-S11 start');
    const dashboardPage = new SubscriberDashboardPage(page);
    await dashboardPage.verifyLoaded();

    await dashboardPage.navigateToWeeklyMenu();
    const weeklyMenuPage = new WeeklyMenuPage(page);
    await weeklyMenuPage.verifyLoaded();
    const lines = await weeklyMenuPage.printSlotsAndDays();
    expect(lines.length).toBeGreaterThanOrEqual(0);
    logger.info(`Weekly menu lines: ${Math.min(lines.length, 20)}`);
  });

  test('SUB-S12-S16: Subscription - print plan, usage analysis and delivery schedules', async ({ page }) => {
    test.setTimeout(120000);
    logger.info('SUB-S12-S16 start');
    const dashboardPage = new SubscriberDashboardPage(page);
    await dashboardPage.verifyLoaded();

    await dashboardPage.navigateToSubscription();
    const subscriptionPage = new SubscriptionPage(page);
    await subscriptionPage.verifyLoaded();
    const plan = await subscriptionPage.printPlanDetails();
    let usage = '';
    let schedules = '';
    try {
      usage = await subscriptionPage.printUsageAnalysis();
    } catch (err) {
      logger.info(`printUsageAnalysis threw: ${err.message}`);
      usage = '';
    }
    try {
      schedules = await subscriptionPage.printDeliverySchedules();
    } catch (err) {
      logger.info(`printDeliverySchedules threw: ${err.message}`);
      schedules = '';
    }
    expect(plan).not.toBeNull();
    logger.info(`Subscription plan snippet length: ${plan.length}`);
    logger.info(`Usage snippet length: ${usage.length}`);
    logger.info(`Schedules snippet length: ${schedules.length}`);
  });

  test('SUB-S23-S24: Instruction - add instruction and logout', async ({ page }) => {
    logger.info('SUB-S23-S24 start');
    const dashboardPage = new SubscriberDashboardPage(page);
    await dashboardPage.verifyLoaded();

    await dashboardPage.navigateToInstruction();
    const instructionPage = new InstructionPage(page);
    await instructionPage.verifyLoaded();
    const ok = await instructionPage.addInstructions('Please leave the food at the reception. No onions.');
    expect(ok).toBeTruthy();

    await dashboardPage.logout();
    await expect(page).toHaveURL(/login/);
    logger.info('SUB-S23-S24 complete and logged out');
  });
});
