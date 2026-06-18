const { pageLogger } = require('../../utils/logger');
const logger = pageLogger('DashboardPage');

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: /dashboard|admin portal/i });
    this.subscribersLink = page.getByRole('link', { name: /subscribers?/i });
    this.deliveriesLink = page.getByRole('link', { name: /deliveries?/i });
    this.requestsLink = page.getByRole('link', { name: /requests?/i });
    this.menuItemsLink = page.locator('a[href="/admin/menu"]', { hasText: /^Menu Items$/i }).first();
    this.menuLink = page.locator('a[href="/admin/weekly-menus"]', { hasText: /^Menus$/i }).first();
    this.timeSlotsLink = page.getByRole('link', { name: /time ?slots?/i });
    this.kitchenLink = page.getByRole('link', { name: /kitchens?/i });
    this.logoutButton = page.getByRole('button', { name: /logout/i });
    logger.info('DashboardPage initialized');
  }

  async verifyLoaded() {
    logger.info('Verifying Admin dashboard loaded');
    await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
    logger.info('Admin dashboard loaded');
  }

  async navigateToSubscribers() {
    logger.action('Navigating to Subscribers');
    await Promise.all([
      this.page.waitForURL(/\/admin\/users(\/|$)/, { timeout: 15000 }),
      this.subscribersLink.click(),
    ]);
  }

  async navigateToDeliveries() {
    logger.action('Navigating to Deliveries');
    await Promise.all([
      this.page.waitForURL(/\/admin\/deliveries(\/|$)/, { timeout: 15000 }),
      this.deliveriesLink.click(),
    ]);
  }

  async navigateToRequests() {
    logger.action('Navigating to Requests');
    await Promise.all([
      this.page.waitForURL(/\/admin\/change-requests(\/|$)/, { timeout: 15000 }),
      this.requestsLink.click(),
    ]);
  }

  async navigateToMenuItems() {
    logger.action('Navigating to Menu Items');
    await this.menuItemsLink.waitFor({ state: 'visible', timeout: 15000 });
    const href = await this.menuItemsLink.getAttribute('href');
    await Promise.all([
      this.page.waitForURL(/\/admin\/menu(\/|$)/, { timeout: 25000 }).catch(() => null),
      this.menuItemsLink.click(),
    ]);
    if (!/\/admin\/menu(\/|$)/.test(this.page.url())) {
      logger.warn('Menu Items click did not reach expected URL; navigating directly');
      await this.page.goto('/admin/menu');
      await this.page.waitForURL(/\/admin\/menu(\/|$)/, { timeout: 25000 });
    }
    await this.page.waitForLoadState('networkidle');
    const currentUrl = this.page.url();
    const menuHeadingCount = await this.page.locator('h1:has-text("Menu Items")').count();
    logger.info(`Current URL after Menu Items nav: ${currentUrl}`);
    logger.info(`Menu Items heading candidates found: ${menuHeadingCount}`);
    await Promise.all([
      this.page.waitForSelector('h1:has-text("Menu Items")', { state: 'visible', timeout: 30000 }),
      this.page.locator('button:has-text("Add Menu Item")').first().waitFor({ state: 'visible', timeout: 30000 }),
    ]);
  }

  async navigateToMenu() {
    logger.action('Navigating to Weekly Menus');
    await Promise.all([
      this.page.waitForURL(/\/admin\/weekly-menus(\/|$)/, { timeout: 15000 }),
      this.menuLink.click(),
    ]);
  }

  async navigateToTimeSlots() {
    logger.action('Navigating to Time Slots');
    await Promise.all([
      this.page.waitForURL(/\/admin\/time-slots(\/|$)/, { timeout: 15000 }),
      this.timeSlotsLink.click(),
    ]);
  }

  async navigateToKitchen() {
    logger.action('Navigating to Kitchen');
    await Promise.all([
      this.page.waitForURL(/\/admin\/kitchens(\/|$)/, { timeout: 15000 }),
      this.kitchenLink.click(),
    ]);
  }

  async getActiveSubscribersCount() {
    logger.info('Reading active subscriber count from dashboard');
    const activeCard = this.page.locator('div:has-text("ACTIVE SUBSCRIBERS")').first();
    await activeCard.waitFor({ state: 'visible', timeout: 15000 });
    const cardText = await activeCard.textContent();
    const match = cardText?.match(/(\d+)/);
    if (!match) {
      throw new Error('Could not parse active subscriber count from dashboard card');
    }
    const count = parseInt(match[1], 10);
    logger.info(`Active subscriber count: ${count}`);
    return count;
  }

  async clickTomorrow() {
    logger.action('Navigating dashboard to Tomorrow');
    const selectors = [
      'button:has-text("Tomorrow")',
      'button[aria-label="Next day"]',
      '.day-nav .next',
      'button[title="Next"]',
    ];
    for (const sel of selectors) {
      const el = this.page.locator(sel).first();
      if (await el.count() > 0) {
        await el.click();
        logger.info(`Clicked day navigation using selector: ${sel}`);
        await this.page.waitForTimeout(500);
        return;
      }
    }
    logger.warn('Could not find Tomorrow navigation control');
  }

  async clickToday() {
    logger.action('Navigating dashboard to Today');
    const selectors = [
      'button:has-text("Today")',
      'button[aria-label="Today"]',
      '.day-nav .today',
      'button[title="Today"]',
    ];
    for (const sel of selectors) {
      const el = this.page.locator(sel).first();
      if (await el.count() > 0) {
        await el.click();
        logger.info(`Clicked day navigation using selector: ${sel}`);
        await this.page.waitForTimeout(500);
        return;
      }
    }
    logger.warn('Could not find Today navigation control');
  }

  async getDeliveriesTodayCount() {
    logger.info('Reading deliveries today count from dashboard');
    const card = this.page.locator('div:has-text("DELIVERIES TODAY")').first();
    if (await card.count() === 0) {
      logger.warn('Deliveries Today card not found');
      return null;
    }
    await card.waitFor({ state: 'visible', timeout: 10000 });
    const text = await card.textContent();
    const m = text?.match(/(\d+)/);
    const count = m ? parseInt(m[1], 10) : null;
    logger.info(`Deliveries Today count: ${count}`);
    return count;
  }

  async markAllDeliveriesInTimeSlot(timeSlotLabel, kitchenName) {
    logger.action(`Marking all deliveries for timeslot: ${timeSlotLabel}`);
    const slot = this.page.locator(`div:has-text("${timeSlotLabel}")`).first();
    if (await slot.count() === 0) {
      logger.warn(`Timeslot section not found: ${timeSlotLabel}`);
      return false;
    }
    const markAllBtn = slot.locator('button:has-text("Mark all")').first();
    if (await markAllBtn.count() === 0) {
      logger.warn('Mark all button not found in timeslot');
      return false;
    }
    await markAllBtn.click();
    // handle kitchen selection popup
    const popup = this.page.getByRole('dialog');
    if (await popup.count() > 0) {
      logger.info('Kitchen selection popup displayed');
      const kitchenOption = popup.locator(`text=${kitchenName}`).first();
      if (await kitchenOption.count() > 0) await kitchenOption.click();
      const confirm = popup.getByRole('button', { name: /confirm|ok|yes/i }).first();
      if (await confirm.count() > 0) await confirm.click();
      logger.info('Confirmed kitchen selection for mark all');
      await this.page.waitForTimeout(500);
      return true;
    }
    logger.warn('No kitchen selection popup appeared after mark all');
    return false;
  }

  async markIndividualDeliveryForUser(username, kitchenName, timeSlotLabel) {
    logger.action(`Marking individual delivery for user: ${username}`);
    const userEl = this.page.locator('div', { hasText: new RegExp(username, 'i') }).first();
    if (await userEl.count() === 0) {
      logger.warn(`User element not found on dashboard: ${username}`);
      return false;
    }

    await userEl.scrollIntoViewIfNeeded();

    // try to open scheduled dropdown near the user
    const dropdown = userEl.locator('button[role="combobox"], button[aria-haspopup], button:has-text("Scheduled"), .scheduled-dropdown').first();
    if (await dropdown.count() > 0 && await dropdown.isVisible()) {
      await dropdown.click({ timeout: 8000 });
      logger.info('Opened user scheduled dropdown');
      const deliverOpt = this.page.locator('text=Delivery').first();
      const skipOpt = this.page.locator('text=Skip').first();
      if (await deliverOpt.count() > 0) await deliverOpt.click();
      else if (await skipOpt.count() > 0) await skipOpt.click();
      // after selecting delivery, popup for kitchen
      const popup = this.page.getByRole('dialog');
      if (await popup.count() > 0) {
        const kitchenOption = popup.locator(`text=${kitchenName}`).first();
        if (await kitchenOption.count() > 0) await kitchenOption.click();
        const confirm = popup.getByRole('button', { name: /confirm|ok|yes/i }).first();
        if (await confirm.count() > 0) await confirm.click();
        logger.info(`Marked delivery for ${username} with kitchen ${kitchenName}`);
        await this.page.waitForTimeout(500);
        return true;
      }
      logger.warn('No kitchen popup shown after marking individual delivery');
      return false;
    }

    logger.warn('Scheduled dropdown not found or not visible for user');
    return false;
  }

  async goto() {
    logger.action('Navigating to Admin dashboard');
    await this.page.goto('/admin');
    await this.verifyLoaded();
  }

  async logout() {
    logger.action('Clicking admin logout button');
    await this.logoutButton.click();
    await this.page.waitForURL('**/login', { timeout: 20000 });
    logger.info('Admin logout complete');
  }
}

module.exports = { DashboardPage };