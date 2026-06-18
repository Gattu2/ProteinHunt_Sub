const { pageLogger } = require('../../utils/logger');
const logger = pageLogger('SubscriptionPage');

class SubscriptionPage {
  constructor(page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: /subscription/i });
    logger.info('SubscriptionPage initialized');
  }

  async verifyLoaded() {
    logger.info('Verifying Subscription page loaded');
    const hasHeading = await this.pageHeading.isVisible().catch(() => false);
    if (!hasHeading) {
      await this.page.waitForURL(/\/subscription/, { timeout: 20000 });
      await this.page.getByRole('heading', { name: /subscription overview/i }).first().waitFor({ state: 'visible', timeout: 20000 });
    }
    logger.info('Subscription page loaded');
  }

  async printPlanDetails() {
    logger.action('Printing plan details from Subscription page');
    try {
      const container = this.page.locator('div:has(h4:has-text("Plan Details"))').first();
      if ((await container.count().catch(() => 0)) === 0) {
        logger.info('Plan details container not found; skipping extraction');
        return '';
      }
      await container.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      const text = (await container.first().textContent().catch(() => '') ) || '';
      logger.info(`Plan details snippet: ${text.slice(0, 800)}`);
      return text;
    } catch (err) {
      logger.info(`printPlanDetails error: ${err.message}`);
      return '';
    }
  }

  async printUsageAnalysis() {
    logger.action('Printing usage analysis from Subscription page');
    try {
      const container = this.page.locator('div:has(h4:has-text("Usage Analytics"))').first();
      if ((await container.count().catch(() => 0)) === 0) {
        logger.info('Usage analysis container not found; skipping extraction');
        return '';
      }
      await container.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      const text = (await container.first().textContent().catch(() => '') ) || '';
      logger.info(`Usage analysis snippet: ${text.slice(0, 800)}`);
      return text;
    } catch (err) {
      logger.info(`printUsageAnalysis error: ${err.message}`);
      return '';
    }
  }

  async printDeliverySchedules() {
    logger.action('Printing delivery schedules from Subscription page');
    try {
      const container = this.page.locator('div:has(h4:has-text("Delivery Schedule"))').first();
      if ((await container.count().catch(() => 0)) === 0) {
        logger.info('Delivery schedules container not found; skipping extraction');
        return '';
      }
      await container.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      const text = (await container.first().textContent().catch(() => '') ) || '';
      logger.info(`Delivery schedules snippet: ${text.slice(0, 800)}`);
      return text;
    } catch (err) {
      logger.info(`printDeliverySchedules error: ${err.message}`);
      return '';
    }
  }
}

module.exports = { SubscriptionPage };