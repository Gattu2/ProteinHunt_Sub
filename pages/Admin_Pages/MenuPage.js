const { pageLogger } = require('../../utils/logger');
const logger = pageLogger('MenuPage');

class MenuPage {
  constructor(page) {
    this.page = page;
    this.pageHeading = page.locator('h1:has-text("Weekly Menus")').first();
    logger.info('MenuPage initialized');
  }

  async verifyLoaded() {
    logger.info('Verifying Menu page loaded');
    await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
    logger.info('Menu page loaded');
  }

  async openCreateMenuDialog() {
    logger.action('Opening Create Menu dialog');
    const addButton = this.page.getByRole('button', { name: /add.*menu|create.*menu|new menu/i }).first();
    await Promise.all([
      this.page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 15000 }),
      addButton.click(),
    ]);
    logger.info('Create Menu dialog opened');
  }

  async createMenu(menuName, menuType) {
    logger.action(`Creating menu: ${menuName}`);
    await this.openCreateMenuDialog();
    const nameInput = this.page.getByLabel(/menu name|name/i).first();
    await nameInput.fill(menuName);
    if (menuType) {
      const menuTypeSelect = this.page.locator('label:has-text("Menu Type")').locator('..').locator('[role="combobox"]').first();
      await this.selectDropdownValue(menuTypeSelect, menuType);
    }
    const saveButton = this.page.getByRole('button', { name: /save|create|add/i }).first();
    await saveButton.click();
    await this.page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 20000 }).catch(() => {});
    const menuHeading = this.page.locator('h3', { hasText: this.createMenuNameRegex(menuName) }).first();
    await menuHeading.waitFor({ state: 'visible', timeout: 20000 });
    logger.info(`Menu created: ${menuName}`);
  }

  normalizeMenuTitle(title) {
    return title.toString().replace(/\s+/g, ' ').trim();
  }

  createMenuNameRegex(menuName) {
    const normalized = this.normalizeMenuTitle(menuName);
    let escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    escaped = escaped.replace(/&/g, '(?:&|&amp;)');
    escaped = escaped.replace(/\s+/g, '\\s+');
    return new RegExp(`^${escaped}$`, 'i');
  }

  async findMenuRow(menuName) {
    const regex = this.createMenuNameRegex(menuName);
    const card = this.page.locator('div', { has: this.page.locator('h3', { hasText: regex }) }).first();
    if (await card.count() > 0) {
      return card;
    }
    return this.page.locator('table tbody tr', { hasText: regex }).first();
  }

  async isMenuPresent(menuName) {
    const row = await this.findMenuRow(menuName);
    return row && (await row.count()) > 0;
  }

  async viewMenu(menuName) {
    logger.action(`Viewing menu: ${menuName}`);
    const row = await this.findMenuRow(menuName);
    if (!row || (await row.count()) === 0) {
      throw new Error(`Menu row not found: ${menuName}`);
    }
    const viewButton = row.getByRole('button', { name: /view|edit|open/i }).first();
    await Promise.all([
      this.page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 15000 }),
      viewButton.click(),
    ]);
    logger.info(`Menu dialog opened for: ${menuName}`);
  }

  async addMealsToMenu(menuName, mealsByDay = {}) {
    logger.action(`Adding meals to menu: ${menuName}`);
    await this.viewMenu(menuName);
    for (const [day, meal] of Object.entries(mealsByDay)) {
      const addButton = this.page.getByRole('button', { name: new RegExp(`add.*${day}|${day}.*add|add meal`, 'i') }).first();
      if (await addButton.count() > 0) {
        await addButton.click();
      } else {
        const generalAdd = this.page.getByRole('button', { name: /add.*meal/i }).first();
        if (await generalAdd.count() > 0) {
          await generalAdd.click();
        }
      }
      const mealInput = this.page.getByRole('textbox', { name: /meal name|item name|dish/i }).first();
      if (await mealInput.count() > 0) {
        await mealInput.fill(meal);
      }
      const saveButton = this.page.getByRole('button', { name: /save|add|confirm/i }).first();
      await saveButton.click();
      await this.page.waitForTimeout(800);
      logger.info(`Added meal for ${day}: ${meal}`);
    }
    const closeButton = this.page.getByRole('button', { name: /close|done|save/i }).first();
    if (await closeButton.count() > 0) {
      await closeButton.click();
    }
  }

  async bulkReplaceMenuSlot(menuName, slotName, replacementMenuName) {
    logger.action(`Bulk replacing ${slotName} in menu: ${menuName} with ${replacementMenuName}`);
    await this.viewMenu(menuName);
    const bulkButton = this.page.getByRole('button', { name: /bulk replace|replace slot|replace/i }).first();
    await bulkButton.click();
    const slotSelect = this.page.locator('label:has-text("Slot")').locator('..').locator('[role="combobox"]').first();
    await this.selectDropdownValue(slotSelect, slotName);
    const menuSelect = this.page.locator('label:has-text("Menu")').locator('..').locator('[role="combobox"]').first();
    await this.selectDropdownValue(menuSelect, replacementMenuName);
    const confirmButton = this.page.getByRole('button', { name: /confirm|replace|save/i }).first();
    await confirmButton.click();
    await this.page.waitForTimeout(1200);
    const closeButton = this.page.getByRole('button', { name: /close|done|save/i }).first();
    if (await closeButton.count() > 0) {
      await closeButton.click();
    }
    logger.info(`Bulk replace completed for ${slotName} in ${menuName}`);
  }

  async copyMenu(sourceMenuName, newMenuName) {
    logger.action(`Copying menu: ${sourceMenuName} -> ${newMenuName}`);
    const row = await this.findMenuRow(sourceMenuName);
    if (await row.count() === 0) {
      throw new Error(`Source menu not found: ${sourceMenuName}`);
    }
    const copyButton = row.getByRole('button', { name: /copy/i }).first();
    await copyButton.click();
    const nameInput = this.page.getByLabel(/menu name|name/i).first();
    if (await nameInput.count() > 0) {
      await nameInput.fill(newMenuName);
    }
    const saveButton = this.page.getByRole('button', { name: /save|copy|confirm/i }).first();
    await saveButton.click();
    await this.page.waitForTimeout(1200);
    logger.info(`Copied menu to ${newMenuName}`);
  }

  async deleteMenu(menuName) {
    logger.action(`Deleting menu: ${menuName}`);
    const row = await this.findMenuRow(menuName);
    if (await row.count() === 0) {
      logger.warn(`Menu row not found for delete: ${menuName}`);
      return false;
    }
    const deleteButton = row.getByRole('button', { name: /delete/i }).first();
    await deleteButton.click();
    const confirmButton = this.page.getByRole('button', { name: /delete|confirm|yes/i }).first();
    await confirmButton.click();
    await this.page.waitForTimeout(1200);
    logger.info(`Deleted menu: ${menuName}`);
    return true;
  }

  async selectDropdownValue(dropdownLocator, value) {
    if (!value) {
      logger.info('Dropdown selection skipped: empty value');
      return;
    }
    await dropdownLocator.waitFor({ state: 'visible', timeout: 15000 });
    const expanded = await dropdownLocator.getAttribute('aria-expanded');
    if (expanded !== 'true') {
      await dropdownLocator.click();
    }
    const normalizedValue = value.toString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
    const options = this.page.locator('[role="option"]');
    const optionCount = await options.count();
    for (let index = 0; index < optionCount; index++) {
      const option = options.nth(index);
      const optionText = (await option.textContent()) || '';
      const optionNormalized = optionText.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
      if (optionNormalized === normalizedValue || optionText.toLowerCase().includes(value.toString().toLowerCase())) {
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();
        return;
      }
    }
    const fallback = this.page.locator('[role="option"]', { hasText: value }).first();
    await fallback.waitFor({ state: 'visible', timeout: 10000 });
    await fallback.click();
  }
}

module.exports = { MenuPage };