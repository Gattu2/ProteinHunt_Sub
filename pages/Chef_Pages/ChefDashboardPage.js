const { pageLogger } = require('../../utils/logger');
const logger = pageLogger('ChefDashboardPage');

class ChefDashboardPage {
  constructor(page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: /chef dashboard|view meal preparation schedule/i });
    this.mealPrepLink = page.getByRole('link', { name: /meal prep/i });
    this.logoutButton = page.getByRole('button', { name: /logout/i });
    logger.info('ChefDashboardPage initialized');
  }

  async verifyLoaded() {
    logger.info('Verifying Chef dashboard loaded');
    await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
    logger.info('Chef dashboard loaded');
  }

  async navigateToMealPrep() {
    logger.action('Navigating to Meal Prep');
    await Promise.all([
      this.page.waitForURL('**/chef*', { timeout: 15000 }),
      this.mealPrepLink.click(),
    ]);
  }

  async logout() {
    logger.action('Clicking chef logout button');
    await this.logoutButton.click();
    await this.page.waitForURL('**/login', { timeout: 20000 });
    logger.info('Chef logout complete');
  }
}

module.exports = { ChefDashboardPage };