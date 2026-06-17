const { pageLogger } = require('../../utils/logger');
const logger = pageLogger('WeeklyMenuPage');

class WeeklyMenuPage {
  constructor(page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: /weekly/i });
    logger.info('WeeklyMenuPage initialized');
  }

  async verifyLoaded() {
    logger.info('Verifying Weekly Menu page loaded');
    await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
    logger.info('Weekly Menu page loaded');
  }

  async printSlotsAndDays() {
    logger.action('Printing slots and days from Weekly Menu page');
    try {
      if (this.page.isClosed && this.page.isClosed()) {
        logger.info('Page is closed, aborting weekly menu extraction');
        return [];
      }
      const grid = this.page.locator('.weekly-grid, .menu-grid, table.weekly');
      if (await grid.count() === 0) {
        const main = this.page.locator('main, .main, .content, .page-content, #root');
        const textMain = (await main.first().innerText().catch(() => '')) || '';
        const fallbackLines = textMain.split(/\n+/).map(l => l.trim()).filter(Boolean);
        logger.info(`Weekly menu fallback snippet (${Math.min(fallbackLines.length, 20)} lines):\n${fallbackLines.slice(0,20).join('\n')}`);
        return fallbackLines;
      }
      await grid.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      const text = (await grid.first().innerText().catch(() => '')) || '';
      const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
      logger.info(`Weekly menu snippet (${Math.min(lines.length, 20)} lines):\n${lines.slice(0,20).join('\n')}`);
      return lines;
    } catch (err) {
      logger.info(`printSlotsAndDays error: ${err.message}`);
      return [];
    }
  }
}

module.exports = { WeeklyMenuPage };