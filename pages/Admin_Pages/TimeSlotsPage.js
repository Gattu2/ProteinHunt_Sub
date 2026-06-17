const { pageLogger } = require('../../utils/logger');
const logger = pageLogger('TimeSlotsPage');

class TimeSlotsPage {
  constructor(page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: /time ?slots?/i });
    logger.info('TimeSlotsPage initialized');
  }

  async verifyLoaded() {
    logger.info('Verifying Time Slots page loaded');
    await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
    logger.info('Time Slots page loaded');
  }
}

module.exports = { TimeSlotsPage };