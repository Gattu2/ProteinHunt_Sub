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
    const headingVisible = await this.pageHeading.isVisible().catch(() => false);
    if (!headingVisible) {
      await this.page.waitForURL(/\/chef\//, { timeout: 20000 });
      await this.mealPrepLink.waitFor({ state: 'visible', timeout: 20000 });
      await this.logoutButton.waitFor({ state: 'visible', timeout: 20000 });
      logger.info('Chef dashboard verified via URL and navigation controls');
      return;
    }
    logger.info('Chef dashboard loaded');
  }

  async navigateToMealPrep() {
    logger.action('Navigating to Meal Prep');
    if (/\/chef\/dashboard(\/|$)/.test(this.page.url())) {
      logger.info('Already on Chef Meal Prep dashboard route');
      return;
    }

    await this.mealPrepLink.click();
    try {
      await this.page.waitForURL(/\/chef\/(dashboard|meal|weekly-menus|menu)/, { timeout: 15000 });
    } catch (err) {
      logger.warn('Chef navigation click did not trigger URL change; navigating directly to dashboard');
      await this.page.goto('/chef/dashboard');
      await this.page.waitForURL(/\/chef\/dashboard/, { timeout: 15000 });
    }
  }

  async logout() {
    logger.action('Clicking chef logout button');
    await this.logoutButton.click();
    await this.page.waitForURL('**/login', { timeout: 20000 });
    logger.info('Chef logout complete');
  }
}

module.exports = { ChefDashboardPage };