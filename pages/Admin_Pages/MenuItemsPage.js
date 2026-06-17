const { pageLogger } = require('../../utils/logger');
const logger = pageLogger('MenuItemsPage');

class MenuItemsPage {
  constructor(page) {
    this.page = page;
    this.pageHeading = page.locator('h1', { hasText: /menu items/i }).first();
    logger.info('MenuItemsPage initialized');
  }

  async verifyLoaded() {
    logger.info('Verifying Menu Items page loaded');
    await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
    logger.info('Menu Items page loaded');
  }

  async openAddMenuItemDialog() {
    logger.action('Opening Add Menu Item dialog');
    const addButton = await this.getPrimaryButton(/add.*menu item|add item|create item|new item/i);
    await Promise.all([
      this.page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 15000 }),
      addButton.click(),
    ]);
    logger.info('Add Menu Item dialog opened');
  }

  async addMenuItem(item) {
    logger.action(`Adding menu item: ${item.name}`);
    await this.openAddMenuItemDialog();
    await this.fillMenuItemDetails(item);
    const saveButton = await this.getPrimaryButton(/save|create|add/i);
    await saveButton.click();
    await this.page.waitForTimeout(1200);
    logger.info(`Menu item requested: ${item.name}`);
  }

  async fillMenuItemDetails({ menuType, name, description, calories, protein, carbs, fat, ingredients }) {
    logger.action('Filling menu item details');
    const dialog = this.page.locator('[role="dialog"]').first();
    if (name) {
      const nameInput = dialog.locator('label:has-text("Name *")').locator('..').locator('input').first();
      await nameInput.waitFor({ state: 'visible', timeout: 15000 });
      await nameInput.fill(name);
    }
    if (description) {
      const descriptionInput = dialog.locator('label:has-text("Description")').locator('..').locator('textarea').first();
      await descriptionInput.waitFor({ state: 'visible', timeout: 15000 });
      await descriptionInput.fill(description);
    }
    if (calories) {
      const caloriesInput = dialog.locator('label:has-text("Calories")').locator('..').locator('input').first();
      await caloriesInput.waitFor({ state: 'visible', timeout: 15000 });
      await caloriesInput.fill(calories.toString());
    }
    if (protein) {
      const proteinInput = dialog.locator('label:has-text("Protein")').locator('..').locator('input').first();
      await proteinInput.waitFor({ state: 'visible', timeout: 15000 });
      await proteinInput.fill(protein.toString());
    }
    if (carbs) {
      const carbsInput = dialog.locator('label:has-text("Carbs")').locator('..').locator('input').first();
      await carbsInput.waitFor({ state: 'visible', timeout: 15000 });
      await carbsInput.fill(carbs.toString());
    }
    if (fat) {
      const fatInput = dialog.locator('label:has-text("Fat")').locator('..').locator('input').first();
      await fatInput.waitFor({ state: 'visible', timeout: 15000 });
      await fatInput.fill(fat.toString());
    }
    if (ingredients) {
      const ingredientsInput = dialog.locator('label:has-text("Ingredients")').locator('..').locator('textarea').first();
      await ingredientsInput.waitFor({ state: 'visible', timeout: 15000 });
      await ingredientsInput.fill(ingredients);
    }
    if (menuType) {
      const menuTypeSelect = dialog.locator('label:has-text("Menu Type")').locator('..').locator('[role="combobox"]').first();
      await this.selectDropdownValue(menuTypeSelect, menuType);
    }
  }

  normalizeMenuType(menuType) {
    if (!menuType) return '';
    return menuType.toString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
  }

  async selectMenuTypeTab(menuType) {
    if (!menuType) {
      return;
    }
    const normalizedType = this.normalizeMenuType(menuType);
    const escapedMenuType = menuType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let tabButton = this.page.getByRole('button', { name: new RegExp(`^\s*${escapedMenuType}\s*$`, 'i') }).first();
    if (await tabButton.count() === 0) {
      const tabCandidates = this.page.locator('button:visible', { hasText: /Veg|NonVeg|Non-Veg|Veg & Egg/i });
      const count = await tabCandidates.count();
      for (let i = 0; i < count; i++) {
        const candidate = tabCandidates.nth(i);
        const candidateText = (await candidate.textContent()) || '';
        if (this.normalizeMenuType(candidateText) === normalizedType) {
          tabButton = candidate;
          break;
        }
      }
    }

    if (await tabButton.count() === 0) {
      logger.warn(`Menu type tab not found: ${menuType}`);
      return;
    }

    await tabButton.waitFor({ state: 'visible', timeout: 15000 });
    await tabButton.click();
    await this.page.waitForTimeout(250);
  }

  async findMenuItemRow(itemName, menuType) {
    const cardSelector = `div.rounded-2xl:has(h3:has-text("${itemName}"))`;
    const tableSelector = 'table tbody tr';

    const searchInCurrentView = async () => {
      const card = this.page.locator(cardSelector).first();
      if (await card.count() > 0) {
        return card;
      }
      const row = this.page.locator(tableSelector, { hasText: itemName }).first();
      if (await row.count() > 0) {
        return row;
      }
      return null;
    };

    if (menuType) {
      await this.selectMenuTypeTab(menuType);
      const found = await searchInCurrentView();
      if (found) {
        return found;
      }
    }

    const menuTypes = ['Veg', 'Veg & Egg', 'NonVeg'];
    for (const type of menuTypes) {
      await this.selectMenuTypeTab(type);
      const found = await searchInCurrentView();
      if (found) {
        return found;
      }
    }

    return this.page.locator(cardSelector).first();
  }

  async isMenuItemPresent(itemName, menuType) {
    const row = await this.findMenuItemRow(itemName, menuType);
    return row && (await row.count()) > 0;
  }

  async verifyCategoryItems(category, expectedItems = []) {
    logger.action(`Verifying category items for: ${category}`);
    const rows = this.page.locator(`div:has-text("${category}")`);
    await rows.first().waitFor({ state: 'visible', timeout: 15000 });
    const rowText = await rows.allTextContents();
    for (const expected of expectedItems) {
      if (!rowText.some((text) => text.includes(expected))) {
        throw new Error(`Expected menu item not found in category ${category}: ${expected}`);
      }
    }
    logger.info(`Category ${category} contains expected items`);
    return rowText;
  }

  async updateMenuItem(existingName, updates = {}, menuType) {
    logger.action(`Updating menu item: ${existingName}`);
    const row = await this.findMenuItemRow(existingName, menuType);
    if (await row.count() === 0) {
      throw new Error(`Menu item row not found: ${existingName}`);
    }
    const editButton = await this.findCardActionButton(row, /edit|pen|square-pen/i);
    await Promise.all([
      this.page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 15000 }),
      editButton.click(),
    ]);
    await this.fillMenuItemDetails(updates);
    const saveButton = await this.getPrimaryButton(/save|update|submit/i);
    await saveButton.click();
    await this.page.waitForTimeout(1200);
    logger.info(`Menu item updated: ${existingName}`);
  }

  async deleteMenuItem(itemName, menuType) {
    logger.action(`Deleting menu item: ${itemName}`);
    await this.selectMenuTypeTab(menuType);
    const row = await this.findMenuItemRow(itemName, menuType);
    if (!row || (await row.count()) === 0) {
      logger.warn(`Menu item row not found for delete: ${itemName}`);
      return false;
    }
    const deleteButton = await this.findCardActionButton(row, /delete|trash|remove|trash-2/i);
    await deleteButton.click();
    let confirmButton = null;
    try {
      confirmButton = await this.getPrimaryButton(/delete|confirm|yes|ok/i);
    } catch (error) {
      logger.info('No delete confirmation button detected, assuming delete occurs immediately');
    }
    if (confirmButton) {
      await confirmButton.click();
    }

    const cardSelector = `div.rounded-2xl:has(h3:has-text("${itemName}"))`;
    let removed = false;
    try {
      await Promise.race([
        row.waitFor({ state: 'detached', timeout: 10000 }),
        this.page.waitForFunction(
          (selector) => !document.querySelector(selector),
          cardSelector,
          { timeout: 10000 }
        ),
      ]);
      removed = true;
    } catch (error) {
      logger.warn('Menu item row did not detach or disappear within timeout after delete action');
    }

    await this.page.waitForTimeout(250);
    const stillPresent = await this.isMenuItemPresent(itemName, menuType);
    if (stillPresent) {
      logger.warn(`Menu item still present after delete action: ${itemName}`);
      if (await this.page.locator(cardSelector).count() === 0) {
        logger.info('Menu item card is not present, but findMenuItemRow still returned a reference due to stale locator');
        return true;
      }
      return false;
    }
    if (!removed) {
      logger.info(`Menu item disappearance was confirmed by presence check even though the original DOM node did not detach: ${itemName}`);
    }
    logger.info(`Menu item deleted: ${itemName}`);
    return true;
  }

  async findCardActionButton(cardLocator, nameRegex) {
    const normalizedName = nameRegex instanceof RegExp ? nameRegex.source : nameRegex.toString();
    let button = cardLocator.getByRole('button', { name: nameRegex }).first();
    if (await button.count() > 0) {
      return button;
    }

    const actionSelectors = [
      { regex: /edit|pen|square-pen/i, selector: 'button:has(svg.lucide-square-pen), button:has(svg.lucide-pen)' },
      { regex: /delete|trash|remove/i, selector: 'button:has(svg.lucide-trash2), button:has(svg.lucide-trash)' },
    ];

    for (const action of actionSelectors) {
      if (new RegExp(action.regex).test(normalizedName)) {
        const actionButton = cardLocator.locator(action.selector).first();
        if (await actionButton.count() > 0) {
          return actionButton;
        }
      }
    }

    button = cardLocator.locator('button[aria-label*="edit" i], button[title*="edit" i], button[aria-label*="delete" i], button[title*="delete" i]').first();
    if (await button.count() > 0) {
      return button;
    }

    const fallbackButton = cardLocator.locator('button:has-text("Delete"), button:has-text("Remove")').first();
    if (await fallbackButton.count() > 0) {
      return fallbackButton;
    }

    const visibleButtons = cardLocator.locator('button:visible');
    if (await visibleButtons.count() > 0) {
      return visibleButtons.first();
    }

    return cardLocator.locator('button').first();
  }

  async printSampleItems(category) {
    logger.action(`Printing sample items for category: ${category}`);
    const rows = this.page.locator('table tbody tr', { hasText: category });
    const contents = await rows.allTextContents();
    logger.info(`Sample items (${Math.min(contents.length, 10)}): ${contents.slice(0, 10).join(' | ')}`);
    return contents;
  }

  async selectDropdownValue(dropdownLocator, value) {
    if (!value) {
      logger.info('Dropdown selection skipped because value is empty');
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
      const optionText = await option.textContent() || '';
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

  async getPrimaryButton(labelRegex) {
    let button = this.page.getByRole('button', { name: labelRegex }).first();
    if (await button.count() === 0) {
      button = this.page.locator('button', { hasText: labelRegex }).first();
    }
    await button.waitFor({ state: 'visible', timeout: 15000 });
    return button;
  }
}

module.exports = { MenuItemsPage };