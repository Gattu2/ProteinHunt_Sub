const { pageLogger } = require('../../utils/logger');
const logger = pageLogger('FuelStationPage');

class FuelStationPage {
  constructor(page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: /fuel station|welcome back|dashboard/i });
    logger.info('FuelStationPage initialized');
  }

  async verifyLoaded() {
    logger.info('Verifying Fuel Station page loaded');
    await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
    logger.info('Fuel Station page loaded');
  }

  async verifyActiveSubscriptionDetails() {
    logger.action('Verifying active subscription details on Fuel Station page');
    const content = (await this.page.locator('main, section, div').first().innerText().catch(() => '')) || '';
    const activeMatch = content.match(/Active\s*Subscription\s*[:\-]?\s*(\d+)/i);
    const todayMatch = content.match(/Today(?:\s*deliver(?:ies)?)?\s*[:\-]?\s*(\d+)/i);
    const tomorrowMatch = content.match(/Tomorrow(?:\s*deliver(?:ies)?)?\s*[:\-]?\s*(\d+)/i);
    logger.info(`FuelStation: active=${activeMatch ? activeMatch[1] : 'n/a'}, today=${todayMatch ? todayMatch[1] : 'n/a'}, tomorrow=${tomorrowMatch ? tomorrowMatch[1] : 'n/a'}`);
    return {
      active: activeMatch ? parseInt(activeMatch[1], 10) : null,
      today: todayMatch ? parseInt(todayMatch[1], 10) : null,
      tomorrow: tomorrowMatch ? parseInt(tomorrowMatch[1], 10) : null,
    };
  }
}

module.exports = { FuelStationPage };