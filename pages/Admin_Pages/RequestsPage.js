const { pageLogger } = require('../../utils/logger');
const logger = pageLogger('RequestsPage');

class RequestsPage {
  constructor(page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: /requests?/i });
    logger.info('RequestsPage initialized');
  }

  async verifyLoaded() {
    logger.info('Verifying Requests page loaded');
    await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
    logger.info('Requests page loaded');
  }
}

module.exports = { RequestsPage };