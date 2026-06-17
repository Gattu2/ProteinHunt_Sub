const { pageLogger } = require('../../utils/logger');
const logger = pageLogger('DeliveriesPage');

class DeliveriesPage {
  constructor(page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: /deliveries?/i });
    logger.info('DeliveriesPage initialized');
  }

  async verifyLoaded() {
    logger.info('Verifying Deliveries page loaded');
    await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
    logger.info('Deliveries page loaded');
  }
}

module.exports = { DeliveriesPage };