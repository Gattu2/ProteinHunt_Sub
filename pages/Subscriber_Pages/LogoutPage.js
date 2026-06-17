const { pageLogger } = require('../../utils/logger');
const logger = pageLogger('SubscriberLogoutPage');

class LogoutPage {
  constructor(page) {
    this.page = page;
    this.logoutButton = page.getByRole('button', { name: /logout/i });
    logger.info('Subscriber LogoutPage initialized');
  }

  async logout() {
    logger.action('Clicking subscriber logout button');
    await this.logoutButton.click();
    await this.page.waitForURL('**/login', { timeout: 20000 });
    logger.info('Subscriber logout complete');
  }
}

module.exports = { LogoutPage };