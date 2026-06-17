const { pageLogger } = require('../../utils/logger');
const logger = pageLogger('MyDeliveriesPage');

class MyDeliveriesPage {
  constructor(page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: /my deliveries/i });
    logger.info('MyDeliveriesPage initialized');
  }

  async verifyLoaded() {
    logger.info('Verifying My Deliveries page loaded');
    await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
    logger.info('My Deliveries page loaded');
  }

  async verifyUpcomingSlots() {
    logger.action('Verifying upcoming slots on My Deliveries page');
    try {
      if (this.page.isClosed && this.page.isClosed()) {
        logger.info('Page is closed, aborting upcoming slots check');
        return '';
      }
      const upcomingTab = this.page.getByRole('tab', { name: /upcoming/i }).first();
      if (await upcomingTab.count() > 0) {
        await upcomingTab.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
        await upcomingTab.click().catch(() => {});
      }
      const list = this.page.locator('table.upcoming, .upcoming-list, [data-testid="upcoming"]');
      if (await list.count() === 0) {
        // fallback: read main content or deliveries container when grid/table not present
        const main = this.page.locator('main, .main, .content, .page-content, #root');
        const text = (await main.first().innerText().catch(() => '')) || '';
        logger.info('Upcoming fallback snippet from main content');
        logger.info(`${text.slice(0, 800)}`);
        return text;
      }
      await list.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      const text = (await list.first().innerText().catch(() => '')) || '';
      logger.info(`Upcoming slots/content snippet: ${text.slice(0, 300)}`);
      return text;
    } catch (err) {
      logger.info(`verifyUpcomingSlots error: ${err.message}`);
      return '';
    }
  }

  async verifyHistory() {
    logger.action('Verifying history tab on My Deliveries page');
    try {
      if (this.page.isClosed && this.page.isClosed()) {
        logger.info('Page is closed, aborting history check');
        return 0;
      }
      const historyTab = this.page.getByRole('tab', { name: /history/i }).first();
      if (await historyTab.count() > 0) {
        await historyTab.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
        await historyTab.click().catch(() => {});
      }
      const rows = this.page.locator('table.history tbody tr');
      await rows.first().waitFor({ state: 'attached', timeout: 3000 }).catch(() => {});
      const count = await rows.count().catch(() => 0);
      logger.info(`History rows found: ${count}`);
      return count;
    } catch (err) {
      logger.info(`verifyHistory error: ${err.message}`);
      return 0;
    }
  }

  async verifyLegacy() {
    logger.action('Verifying legacy tab on My Deliveries page');
    try {
      if (this.page.isClosed && this.page.isClosed()) {
        logger.info('Page is closed, aborting legacy check');
        return 0;
      }
      const legacyTab = this.page.getByRole('tab', { name: /legacy|outside system/i }).first();
      if (await legacyTab.count() > 0) {
        await legacyTab.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
        await legacyTab.click().catch(() => {});
      }
      const rows = this.page.locator('table.legacy tbody tr');
      await rows.first().waitFor({ state: 'attached', timeout: 3000 }).catch(() => {});
      const count = await rows.count().catch(() => 0);
      logger.info(`Legacy rows found: ${count}`);
      return count;
    } catch (err) {
      logger.info(`verifyLegacy error: ${err.message}`);
      return 0;
    }
  }
}

module.exports = { MyDeliveriesPage };