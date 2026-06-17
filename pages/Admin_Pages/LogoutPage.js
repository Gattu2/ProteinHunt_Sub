const { pageLogger } = require('../../utils/logger');
const logger = pageLogger('AdminLogoutPage');

class LogoutPage {
  constructor(page) {
    this.page = page;
    this.logoutButton = page.getByRole('button', { name: /logout/i });
    logger.info('Admin LogoutPage initialized');
  }

  async logout() {
    logger.action('Clicking admin logout button');
    await this.logoutButton.click();
    await this.page.waitForURL('**/login', { timeout: 20000 });
    logger.info('Admin logout complete');
  }
}

module.exports = { LogoutPage };