const { pageLogger } = require('../../utils/logger');
const logger = pageLogger('KitchenPage');

class KitchenPage {
  constructor(page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: /kitchen/i });
    logger.info('KitchenPage initialized');
  }

  async verifyLoaded() {
    logger.info('Verifying Kitchen page loaded');
    await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
    logger.info('Kitchen page loaded');
  }
}

module.exports = { KitchenPage };