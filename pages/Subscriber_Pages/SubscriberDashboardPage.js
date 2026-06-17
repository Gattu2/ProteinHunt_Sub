const { pageLogger } = require('../../utils/logger');
const logger = pageLogger('SubscriberDashboardPage');

class SubscriberDashboardPage {
  constructor(page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: /welcome back/i });
    this.fuelStationLink = page.getByRole('link', { name: /fuel station/i });
    this.myDeliveriesLink = page.getByRole('link', { name: /my deliveries/i });
    this.weeklyMenuLink = page.getByRole('link', { name: /weekly menu/i });
    this.subscriptionLink = page.getByRole('link', { name: /subscription/i });
    this.instructionLink = page.getByRole('link', { name: /instructions?/i });
    this.logoutButton = page.getByRole('button', { name: /logout/i });
    logger.info('SubscriberDashboardPage initialized');
  }

  async verifyLoaded() {
    logger.info('Verifying Subscriber dashboard loaded');
    await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
    logger.info('Subscriber dashboard loaded');
  }

  async navigateToFuelStation() {
    logger.action('Navigating to Fuel Station');
    await Promise.all([
      this.page.waitForURL('**/dashboard*', { timeout: 15000 }),
      this.fuelStationLink.click(),
    ]);
  }

  async navigateToMyDeliveries() {
    logger.action('Navigating to My Deliveries');
    await Promise.all([
      this.page.waitForURL('**/deliveries*', { timeout: 15000 }),
      this.myDeliveriesLink.click(),
    ]);
  }

  async navigateToWeeklyMenu() {
    logger.action('Navigating to Weekly Menu');
    await Promise.all([
      this.page.waitForURL('**/menu*', { timeout: 15000 }),
      this.weeklyMenuLink.click(),
    ]);
  }

  async navigateToSubscription() {
    logger.action('Navigating to Subscription');
    await Promise.all([
      this.page.waitForURL('**/subscription*', { timeout: 15000 }),
      this.subscriptionLink.click(),
    ]);
  }

  async navigateToInstruction() {
    logger.action('Navigating to Instruction');
    await Promise.all([
      this.page.waitForURL('**/instructions*', { timeout: 15000 }),
      this.instructionLink.click(),
    ]);
  }

  async logout() {
    logger.action('Clicking subscriber logout button');
    await this.logoutButton.click();
    await this.page.waitForURL('**/login', { timeout: 20000 });
    logger.info('Subscriber logout complete');
  }
}

module.exports = { SubscriberDashboardPage };