const { pageLogger } = require('../../utils/logger');
const logger = pageLogger('ChefLogoutPage');

class LogoutPage {
  constructor(page) {
    this.page = page;
    this.logoutButton = page.getByRole('button', { name: /logout/i });
    logger.info('LogoutPage initialized');
  }

  async logout() {
    logger.action('Clicking chef logout button');
    await this.logoutButton.click();
    await this.page.waitForURL('**/login', { timeout: 20000 });
    logger.info('Chef logout complete');
  }
}

module.exports = { LogoutPage };