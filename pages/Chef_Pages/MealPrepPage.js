const { pageLogger } = require('../../utils/logger');
const logger = pageLogger('MealPrepPage');

class MealPrepPage {
  constructor(page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: /chef dashboard|meal prep|view meal preparation schedule/i });
    logger.info('MealPrepPage initialized');
  }

  async verifyLoaded() {
    logger.info('Verifying Meal Prep page loaded');
    const hasHeading = await this.pageHeading.isVisible().catch(() => false);
    if (!hasHeading) {
      await this.page.waitForURL(/\/chef\//, { timeout: 20000 });
      await this.page.getByRole('link', { name: /meal prep/i }).first().waitFor({ state: 'visible', timeout: 20000 });
      logger.info('Meal Prep page verified via route and nav link visibility');
      return;
    }
    logger.info('Meal Prep page loaded');
  }
}

module.exports = { MealPrepPage };