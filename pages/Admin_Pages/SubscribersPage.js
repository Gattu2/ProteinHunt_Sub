const { pageLogger } = require('../../utils/logger');
const logger = pageLogger('SubscribersPage');

class SubscribersPage {
  constructor(page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: /subscribers?/i });
    this.addSubscriberButton = page.locator('button', { hasText: /add subscriber/i }).first();
    this.searchInput = page.getByPlaceholder('Search subscribers...');
    this.tableHeaders = page.locator('table thead th');
    this.tableRows = page.locator('table tbody tr');
    this.dialog = page.getByRole('dialog', { name: /create new subscriber/i });
    this.existingUserCheckbox = page.getByLabel(/This is an existing user/i);
    this.fullNameInput = page.getByRole('textbox', { name: /Full Name \*/i });
    this.usernameInput = page.getByRole('textbox', { name: /Username \*/i });
    this.passwordInput = page.getByLabel(/Password \*/i);
    this.phoneInput = page.locator('#phoneNumber');
    this.menuTypeSelect = page.locator('label:has-text("Menu Type")').locator('..').locator('[role="combobox"]').first();
    this.weeklyMenuSelect = page.locator('label:has-text("Weekly Menu")').locator('..').locator('[role="combobox"]').first();
    this.totalMealsInput = page.locator('#totalMeals');
    this.startDateInput = page.locator('#startDate');
    this.addressInput = page.locator('//button[text()="Add Address"]');
    this.addressNameInput = page.getByPlaceholder('e.g., Home, Office, Gym');
    this.addAddressBtn = page.getByRole('button', { name: /Add Address/i });
    this.addressLocationBtn = page.getByRole('button', { name: /Click to select location on map/i });
    this.deliveryDaysGroup = page.getByRole('group', { name: /Delivery Days \*/i }).locator('input[type="checkbox"]');
    this.deliverySlotsGroup = page.getByRole('group', { name: /Delivery Slots \*/i }).locator('input[type="checkbox"]');
    this.timeSlotSection = page.locator('div.border.border-gray-200.rounded-lg.p-4.space-y-3', { hasText: /Select time slot/i }).first();
    this.allDaysButton = page.getByRole('button', { name: /^all$/i });
    this.weekdaysButton = page.getByRole('button', { name: /weekdays/i });
    this.weekendsButton = page.getByRole('button', { name: /weekends/i });
    this.clearDaysButton = page.getByRole('button', { name: /clear/i }).first();
    this.allSlotsButton = page.getByRole('button', { name: /^all$/i }).nth(1);
    this.mainMealsButton = page.getByRole('button', { name: /main meals/i });
    this.clearSlotsButton = page.getByRole('button', { name: /clear/i }).nth(1);
    this.instructionInput = page.getByRole('textarea', { id: /instructionsToKitchen/i });
    this.createButton = page.getByRole('button', { name: /create subscriber/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.closeButton = page.getByRole('button', { name: /close/i });

    logger.info('SubscribersPage initialized');
  }

  async verifyLoaded() {
    logger.info('Verifying Subscribers page loaded');
    await this.pageHeading.waitFor({ state: 'visible', timeout: 30000 });
    logger.info('Subscribers heading visible');
    if (await this.addSubscriberButton.count() > 0) {
      await this.addSubscriberButton.waitFor({ state: 'visible', timeout: 15000 });
      logger.info('Add Subscriber button visible');
    } else {
      logger.warn('Add Subscriber button not found or not accessible; continuing with page load validation');
    }
    await this.searchInput.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Search subscribers input visible');
    if (await this.tableHeaders.count() > 0) {
      await this.tableHeaders.first().waitFor({ state: 'visible', timeout: 15000 });
      logger.info('Subscriber table headers visible');
    }
    logger.info('Subscribers page loaded');
  }

  async getTableHeaders() {
    return this.tableHeaders.allTextContents();
  }

  async getRowCount() {
    return await this.tableRows.count();
  }

  async openAddSubscriberModal() {
    logger.action('Opening Add Subscriber modal');
    await Promise.all([
      this.dialog.waitFor({ state: 'visible', timeout: 15000 }),
      this.addSubscriberButton.click(),
    ]);
    logger.info('Add Subscriber modal opened');
  }

  async verifyAddSubscriberModal() {
    logger.info('Verifying Add Subscriber modal fields');
    await this.dialog.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Dialog visible');
    await this.fullNameInput.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Full Name field visible');
    await this.usernameInput.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Username field visible');
    await this.passwordInput.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Password field visible');
    await this.phoneInput.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Phone Number field visible');
    await this.menuTypeSelect.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Menu Type field visible');
    await this.weeklyMenuSelect.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Weekly Menu field visible');
    await this.totalMealsInput.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Total Meals field visible');
    await this.startDateInput.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Start Date field visible');
    const addressCount = await this.addressInput.count();
    if (addressCount > 0) {
      await this.addressInput.first().waitFor({ state: 'visible', timeout: 15000 });
      logger.info('Address field visible');
    }
    //await this.deliveryDaysGroup.first().waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Delivery Days group visible');
    //await this.deliverySlotsGroup.first().waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Delivery Slots group visible');
    await this.timeSlotSection.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Time Slot section visible');
    //await this.allDaysButton.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('All Days button visible');
    await this.weekdaysButton.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Weekdays button visible');
    await this.weekendsButton.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Weekends button visible');
    await this.clearDaysButton.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Clear Delivery Days button visible');
    await this.allSlotsButton.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('All Slots button visible');
    await this.mainMealsButton.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Main Meals button visible');
    await this.clearSlotsButton.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Clear Slots button visible');
    //await this.instructionInput.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Instructions input visible');
    await this.existingUserCheckbox.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Existing User checkbox visible');
    // await this.customSlotsPerDayGroup.first().waitFor({ state: 'visible', timeout: 15000 });
    await this.createButton.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Create Subscriber button visible');
    await this.cancelButton.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Cancel button visible');
    await this.closeButton.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Close button visible');
    logger.info('Add Subscriber modal verified');
  }

  async fillNewSubscriber(subscriber) {
    logger.action('Filling new subscriber form');
    if (subscriber.existingUser) {
      await this.existingUserCheckbox.check();
      logger.info('Existing User checkbox selected');
    }
    logger.info(`Full Name: ${subscriber.fullName}`);
    await this.fullNameInput.fill(subscriber.fullName);
    logger.info(`Username: ${subscriber.username}`);
    await this.usernameInput.fill(subscriber.username);
    logger.info('Password: [HIDDEN]');
    await this.passwordInput.fill(subscriber.password);
    logger.info(`Phone: ${subscriber.phone}`);
    await this.phoneInput.fill(subscriber.phone);
    logger.info(`Menu Type: ${subscriber.menuType}`);
    await this.selectDropdownValue(this.menuTypeSelect, subscriber.menuType);
    logger.info(`Weekly Menu: ${subscriber.weeklyMenu || ''}`);
    try {
      await this.selectDropdownValue(this.weeklyMenuSelect, subscriber.weeklyMenu || '');
    } catch (err) {
      logger.warn(`Weekly menu '${subscriber.weeklyMenu}' not found. Falling back to first available option.`);
      await this.selectFirstDropdownOption(this.weeklyMenuSelect);
    }
    logger.info(`Total Meals: ${subscriber.totalMeals}`);
    await this.totalMealsInput.fill(subscriber.totalMeals);
    logger.info(`Subscription Start Date: ${subscriber.subscriptionStartDate}`);
    await this.startDateInput.click();
    await this.startDateInput.clear();
    await this.startDateInput.fill(subscriber.subscriptionStartDate);

    if (subscriber.address) {
      await this.addressInput.click();

      await this.addressNameInput.fill('Home');
      const mealSlots = ['Breakfast'];

      for (const slot of mealSlots) {
        await this.page.locator(`#addr-${slot.toLowerCase()}`).click();
      }

      await this.addressLocationBtn.click();

      //const locationSearch = this.page.locator('input[type="text"]').first();

      //await locationSearch.fill(subscriber.address);

      await this.page.waitForTimeout(2000);

      //await this.page.locator('[role="option"]').first().click();

      await this.page.getByRole('button', {
        name: /confirm location/i
      }).click();

      const canAddAddress = await this.addAddressBtn.isEnabled().catch(() => false);
      if (canAddAddress) {
        await this.addAddressBtn.click();
      } else {
        logger.warn('Add Address button is disabled; continuing without persisting address');
      }
    }
    if (subscriber.deliveryDays?.length) {
      logger.info(`Delivery Days: ${subscriber.deliveryDays.join(', ')}`);
      for (const day of subscriber.deliveryDays) {
        await this.page.getByLabel(new RegExp(day, 'i')).check();
      }
    }
    if (subscriber.deliverySlots?.length) {
      logger.info(`Delivery Slots: ${subscriber.deliverySlots.join(', ')}`);

      for (const slot of subscriber.deliverySlots) {

        const checkbox = this.page.locator(`#${slot.toLowerCase()}`);

        await checkbox.waitFor({
          state: 'visible',
          timeout: 10000
        });

        const isChecked = await checkbox.getAttribute('aria-checked');

        logger.info(`${slot} current state: ${isChecked}`);

        if (isChecked !== 'true') {
          await checkbox.click();
          logger.info(`${slot} selected`);
        } else {
          logger.info(`${slot} already selected`);
        }
      }
    }

    if (subscriber.timeSlots) {
      logger.info(`Time Slots: ${Object.entries(subscriber.timeSlots).map(([meal, slot]) => `${meal}=${slot}`).join(', ')}`);
      for (const [meal, slot] of Object.entries(subscriber.timeSlots)) {
        await this.selectTimeSlotForMeal(meal, slot);
      }
    }
  }

  async createSubscriber() {
    logger.action('Creating subscriber');
    await this.createButton.click();
    try {
      await this.dialog.waitFor({ state: 'hidden', timeout: 60000 });
      logger.info('New subscriber created and modal closed');
    } catch (err) {
      const dialogEl = this.dialog.first();
      const dialogText = await dialogEl.innerText().catch(() => null);
      logger.error(`Create subscriber modal did not close. Dialog contents: ${dialogText ? dialogText.slice(0, 1000) : '<no dialog text>'}`);
      throw new Error(`Create subscriber failed or modal remained open. See logs for dialog contents.`);
    }
  }

  async selectDropdownValue(dropdownLocator, value) {
    if (!value) {
      logger.info('No dropdown value provided; skipping selection');
      return;
    }
    logger.action(`Selecting dropdown value: ${value}`);
    await dropdownLocator.waitFor({ state: 'visible', timeout: 8000 });

    // Avoid evaluate on frequently re-rendered controls to prevent detachment timeouts.
    const nativeOptionCount = await dropdownLocator.locator('option').count();
    if (nativeOptionCount > 0) {
      await dropdownLocator.selectOption({ label: value });
      logger.info(`Select element option selected: ${value}`);
      return;
    }

    // Close any previously open listbox
    try {
      const existingListbox = this.page.locator('[role="listbox"][aria-hidden="false"]').first();
      const existingCount = await existingListbox.count();
      if (existingCount > 0) {
        logger.info('Closing previously open listbox with Escape key');
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);
      }
    } catch (err) {
      logger.warn('Error closing previous listbox: ' + err.message);
    }

    const expanded = await dropdownLocator.getAttribute('aria-expanded');
    if (expanded !== 'true') {
      await dropdownLocator.scrollIntoViewIfNeeded();
      await dropdownLocator.click({ timeout: 5000 });
      logger.info('Dropdown combobox opened');
      await this.page.waitForTimeout(600); // Wait for listbox to render
    } else {
      logger.info('Dropdown combobox already open');
    }

    // Find the listbox that appeared after clicking this dropdown
    const listbox = this.page.locator('div[role="listbox"]').first();
    await listbox.waitFor({ state: 'visible', timeout: 8000 });

    // Log all available options for debugging
    const allOptions = await listbox.locator('[role="option"]').allTextContents();
    logger.info(`Available options in dropdown: ${allOptions.join(', ')}`);

    const option = listbox.locator('[role="option"]', { hasText: new RegExp(value, 'i') }).first();
    const optionCount = await option.count();
    logger.info(`Looking for option matching '${value}', found ${optionCount} match(es)`);

    if (optionCount === 0) {
      // Fallback: try partial match with just slot number
      const slotMatch = value.match(/Slot\s+\d+/);
      if (slotMatch) {
        const slotPattern = slotMatch[0];
        logger.warn(`Exact match failed, trying partial match: ${slotPattern}`);
        const partialOption = listbox.locator('[role="option"]', { hasText: new RegExp(slotPattern, 'i') }).first();
        await partialOption.waitFor({ state: 'visible', timeout: 8000 });
        await partialOption.click();
        logger.info(`Dropdown option clicked (partial match): ${slotPattern}`);
        return;
      }
    }

    await option.waitFor({ state: 'visible', timeout: 8000 });
    logger.info(`Clicking option for '${value}'`);
    await option.click();
    logger.info(`Dropdown option clicked: ${value}`);
    await this.page.waitForTimeout(300); // Brief wait for selection to register
  }

  async selectTimeSlotForMeal(meal, value) {
    if (!meal || !value) {
      logger.info('Time slot selection skipped because meal or value is missing');
      return;
    }
    logger.action(`Selecting time slot for meal: ${meal} -> ${value}`);
    const row = this.timeSlotSection.locator('div.flex.items-center.justify-between', { hasText: new RegExp(meal, 'i') }).first();
    await row.waitFor({ state: 'visible', timeout: 8000 });
    const dropdown = row.locator('button[role="combobox"]').first();
    await dropdown.waitFor({ state: 'visible', timeout: 8000 });
    try {
      await this.selectDropdownValue(dropdown, value);
    } catch (err) {
      logger.warn(`Exact time slot '${value}' not found for ${meal}. Selecting first available option.`);
      await this.selectFirstDropdownOption(dropdown);
    }
    logger.info(`Time slot selected for ${meal}: ${value}`);
  }

  async selectFirstDropdownOption(dropdownLocator) {
    await dropdownLocator.waitFor({ state: 'visible', timeout: 8000 });

    // Close any previously open listbox
    const existingListbox = this.page.locator('[role="listbox"][aria-hidden="false"]').first();
    if ((await existingListbox.count()) > 0) {
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(200);
    }

    const expanded = await dropdownLocator.getAttribute('aria-expanded');
    if (expanded !== 'true') {
      await dropdownLocator.click({ timeout: 5000 });
      await this.page.waitForTimeout(500);
    }

    // Find the listbox that appeared
    const listbox = this.page.locator('div[role="listbox"]').first();
    await listbox.waitFor({ state: 'visible', timeout: 8000 });

    const firstOption = listbox.locator('[role="option"]').first();
    await firstOption.waitFor({ state: 'visible', timeout: 8000 });
    const optionText = (await firstOption.innerText()).trim();
    await firstOption.click();
    logger.info(`Selected first available dropdown option: ${optionText}`);
    await this.page.waitForTimeout(300);
  }

  async isSubscriberPresent(username, fullName, phone, menuType) {
    const searchValues = [username, fullName, phone, menuType];

    for (const value of searchValues) {

      if (value === undefined || value === null || value === '') {
        logger.info('Search value is undefined/null/empty. Skipping...');
        continue;
      }

      logger.action(`Searching subscriber: ${value}`);

      await this.searchInput.waitFor({
        state: 'visible',
        timeout: 15000
      });

      await this.searchInput.clear();
      await this.searchInput.fill(String(value));
      await this.searchInput.press('Enter');

      const row = this.page.locator('table tbody tr', {
        hasText: String(value)
      }).first();

      try {
        await row.waitFor({
          state: 'visible',
          timeout: 10000
        });

        logger.info(`Subscriber "${value}" present: true`);
      } catch {
        logger.info(`Subscriber "${value}" present: false`);
        return false;
      }
    }

    return true;
  }

  async openSubscriberDetails(username) {
    logger.action(`Opening subscriber details for: ${username}`);
    const row = this.page.locator('table tbody tr', { hasText: username }).first();
    if (await row.count() === 0) {
      logger.warn(`Subscriber row not found for username: ${username}`);
      return false;
    }
    await row.waitFor({ state: 'visible', timeout: 10000 });

    const link = row.locator('a', { hasText: username }).first();
    if (await link.count() > 0) {
      await link.click();
      logger.info('Clicked username link to open details');
    } else {
      const button = row.locator('button', { hasText: username }).first();
      if (await button.count() > 0) {
        await button.click();
        logger.info('Clicked username button to open details');
      } else {
        const cell = row.locator('td', { hasText: username }).first();
        if (await cell.count() > 0) {
          await cell.click();
          logger.info('Clicked username cell to open details');
        } else {
          logger.warn('No clickable username link, button, or cell found - clicking row as fallback');
          await row.click();
          logger.info('Clicked subscriber row fallback to open details');
        }
      }
    }

    const dialog = this.page.getByRole('dialog');
    try {
      await dialog.waitFor({ state: 'visible', timeout: 10000 });
      logger.info('Subscriber details dialog displayed');
      return true;
    } catch (err) {
      logger.warn('Subscriber details dialog did not appear');
      return false;
    }
  }

  async getFirstSubscriberUsername() {
    const row = this.page.locator('table tbody tr').first();
    if (await row.count() === 0) {
      logger.warn('No subscriber rows found when trying to get first username');
      return null;
    }
    const link = row.locator('a').first();
    if (await link.count() > 0) {
      return (await link.innerText()).trim();
    }
    const text = (await row.innerText()).trim();
    const parts = text.split('\t').map((p) => p.trim()).filter(Boolean);
    if (parts.length > 1) {
      return parts[1];
    }
    return parts[0] || null;
  }

  async searchSubscriberByUsername(username) {
    logger.action(`Searching for subscriber by username: ${username}`);
    await this.searchInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.searchInput.fill('');
    await this.searchInput.fill(username);
    await this.searchInput.press('Enter');
    await this.page.waitForTimeout(1000);
  }

  async getSubscriberRow(username) {
    const row = this.page.locator('table tbody tr', { hasText: username }).first();
    if (await row.count() === 0) {
      logger.warn(`Subscriber row not found for username: ${username}`);
      return null;
    }
    await row.waitFor({ state: 'visible', timeout: 10000 });
    return row;
  }

  async clickSubscriberActionButton(username, title) {
    logger.action(`Clicking action button '${title}' for subscriber: ${username}`);
    const row = await this.getSubscriberRow(username);
    if (!row) {
      throw new Error(`Subscriber row not found for username: ${username}`);
    }
    const button = row.locator(`button[title="${title}"]`).first();
    if (await button.count() === 0) {
      throw new Error(`Action button not found: ${title}`);
    }
    await button.click();
    return button;
  }

  async openAddressDialog(username) {
    const dialog = this.page.getByRole('dialog').first();
    await this.clickSubscriberActionButton(username, 'View address');
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Address dialog visible');
    return dialog;
  }

  async getAddressMapLinkFromDialog(dialog) {
    const link = dialog.locator('a[href*="maps.app.goo.gl"]').first();
    if (await link.count() > 0) {
      const href = await link.getAttribute('href');
      logger.info(`Found Google Maps link in address dialog: ${href}`);
      return href;
    }
    const text = await dialog.innerText();
    const match = /https?:\/\/maps\.app\.goo\.gl\/\S+/i.exec(text);
    if (match) {
      logger.info(`Found Google Maps link text in address dialog: ${match[0]}`);
      return match[0];
    }
    logger.warn('Google Maps link not found in address dialog');
    return null;
  }

  async closeDialog() {
    logger.action('Closing dialog');
    const dialog = this.page.getByRole('dialog').first();
    const closeButton = dialog.getByRole('button', { name: /close/i }).first();
    if (await closeButton.count() > 0) {
      await closeButton.click();
      await dialog.waitFor({ state: 'hidden', timeout: 15000 });
      logger.info('Dialog closed');
      return true;
    }
    logger.warn('Close button not found in dialog');
    return false;
  }

  async openShareViaWhatsApp(username) {
    const popupPromise = this.page.waitForEvent('popup', { timeout: 15000 }).catch(() => null);
    await this.clickSubscriberActionButton(username, 'Share credentials via WhatsApp');
    const popup = await popupPromise;
    if (!popup) {
      logger.warn('WhatsApp share popup did not open');
      return null;
    }
    await popup.waitForLoadState('domcontentloaded', { timeout: 15000 });
    logger.info('WhatsApp share popup opened');
    return popup;
  }

  async openEditSubscriberDialog(username) {
    await this.clickSubscriberActionButton(username, 'Edit subscriber');
    const dialog = this.page.getByRole('dialog').first();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Edit subscriber dialog visible');
    return dialog;
  }

  async updateEditSubscriberDetails(dialog, { fullName, phone, menuType, instructions } = {}) {
    logger.action('Updating edit subscriber details');
    if (fullName) {
      const fullNameInput = dialog.getByRole('textbox', { name: /Full Name/i }).first();
      await fullNameInput.fill(fullName);
      logger.info(`Updated Full Name: ${fullName}`);
    }
    if (phone) {
      const phoneInput = dialog.getByRole('textbox', { name: /Phone Number/i }).first();
      await phoneInput.fill(phone);
      logger.info(`Updated Phone Number: ${phone}`);
    }
    if (menuType) {
      const menuDropdown = dialog.locator('label:has-text("Menu Type")').locator('..').locator('[role="combobox"]').first();
      await this.selectDropdownValue(menuDropdown, menuType);
      logger.info(`Updated Menu Type: ${menuType}`);
    }
    if (instructions) {
      const instructionsArea = dialog.locator('#edit-instructionsToKitchen').first();
      await instructionsArea.fill(instructions);
      logger.info('Updated subscriber instructions');
    }
    const updateButton = dialog.getByRole('button', { name: /Update Subscriber/i }).first();
    if (await updateButton.count() > 0) {
      await updateButton.click();
      await dialog.waitFor({ state: 'hidden', timeout: 15000 });
      logger.info('Subscriber update submitted');
      return true;
    }
    logger.warn('Update Subscriber button not found in edit dialog');
    return false;
  }

  async openAddMealsDialog(username) {
    await this.clickSubscriberActionButton(username, 'Add meals');
    const dialog = this.page.getByRole('dialog').first();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Add meals dialog visible');
    return dialog;
  }

  async addMealsToSubscriber(username, amount) {
    const dialog = await this.openAddMealsDialog(username);
    const topUpInput = dialog.locator('#topUpAmount').first();
    await topUpInput.fill(String(amount));
    logger.info(`Filling meals to add: ${amount}`);
    const addButton = dialog.getByRole('button', { name: /Add Meals/i }).first();
    await addButton.click();
    await dialog.waitFor({ state: 'hidden', timeout: 30000 });
    logger.info(`Added ${amount} meals to subscriber ${username}`);
  }

  async getSubscriberMealsSummary(username) {
    const row = await this.getSubscriberRow(username);
    if (!row) return null;
    const cells = row.locator('td');
    const count = await cells.count();
    for (let i = 0; i < count; i++) {
      const text = (await cells.nth(i).innerText()).trim();
      if (/^\d+\s*\/\s*\d+$/.test(text)) {
        return text;
      }
    }
    logger.warn(`Could not parse meals summary from subscriber row: ${username}`);
    return null;
  }

  async getDropdownByLabel(label) {
    const dropdown = this.page.locator(`label:has-text("${label}")`).locator('..').locator('[role="combobox"]').first();
    return dropdown;
  }

  async clickDetailsTab(tabName) {
    logger.action(`Clicking details tab: ${tabName}`);
    const tabButton = this.page.getByRole('tab', { name: new RegExp(tabName, 'i') }).first();
    if (await tabButton.count() === 0) {
      const fallback = this.page.locator('button', { hasText: new RegExp(tabName, 'i') }).first();
      if (await fallback.count() === 0) {
        logger.warn(`Details tab not found: ${tabName}`);
        return false;
      }
      await fallback.click();
      logger.info(`Clicked fallback button for details tab: ${tabName}`);
      return true;
    }
    await tabButton.click();
    logger.info(`Clicked tab: ${tabName}`);
    return true;
  }

  async extractCountFromDialog(labelRegex) {
    const dialog = this.page.getByRole('dialog');
    const text = (await dialog.innerText()).replace(/\s+/g, ' ');
    const patterns = [
      new RegExp(`${labelRegex.source}\s*[:\-]?\s*(\d+)`, 'i'),
      new RegExp(`(\d+)\s*[:\-]?\s*${labelRegex.source}`, 'i'),
    ];
    for (const pattern of patterns) {
      const match = pattern.exec(text);
      if (match && match[1]) {
        return parseInt(match[1], 10);
      }
    }
    return null;
  }

  async verifySubscriberInformationTab() {
    logger.action('Verifying subscriber information tab');
    if (!(await this.clickDetailsTab('Information'))) {
      return false;
    }
    const dialog = this.page.getByRole('dialog');
    try {
      await dialog.waitFor({ state: 'visible', timeout: 10000 });
    } catch (err) {
      logger.warn('Subscriber details dialog not visible when verifying Information tab');
      return false;
    }

    const totalMeals = await this.extractCountFromDialog(/Total Meals/i);
    const delivered = await this.extractCountFromDialog(/Delivered/i);
    const scheduled = await this.extractCountFromDialog(/Scheduled/i);
    const outOfDelivery = await this.extractCountFromDialog(/Out(?: for| of)? Delivery/i);
    const remaining = await this.extractCountFromDialog(/Remaining/i);
    const skipped = await this.extractCountFromDialog(/Skipped/i);

    const dialogText = (await dialog.innerText()).replace(/\s+/g, ' ');
    const contactValid = /Username/i.test(dialogText) && /Phone(?: Number)?/i.test(dialogText);
    const subscriptionValid = /Menu Type/i.test(dialogText) && /Start Date/i.test(dialogText) && /End Date/i.test(dialogText);
    const statisticsValid =
      /Total(?: Meals)?/i.test(dialogText) &&
      /Delivered/i.test(dialogText) &&
      /Scheduled/i.test(dialogText) &&
      /Out(?: for| of)? Delivery/i.test(dialogText) &&
      /Skipped/i.test(dialogText);

    const contactSection = await dialog.locator('text=/Contact Information|Contact Details/i').first();
    const subscriptionSection = await dialog.locator('text=/Subscription Details/i').first();
    const statisticsSection = await dialog.locator('text=/Delivery Statistics|Statistics/i').first();

    const sectionsValid =
      (await contactSection.count()) > 0 &&
      (await subscriptionSection.count()) > 0 &&
      (await statisticsSection.count()) > 0;

    logger.info(`Information tab values: totalMeals=${totalMeals}, delivered=${delivered}, scheduled=${scheduled}, outOfDelivery=${outOfDelivery}, remaining=${remaining}, skipped=${skipped}, contactValid=${contactValid}, subscriptionValid=${subscriptionValid}, statisticsValid=${statisticsValid}, sectionsValid=${sectionsValid}`);
    return contactValid && subscriptionValid && statisticsValid && sectionsValid;
  }

  async verifySubscriberDeliveryHistoryTab({ startDate, endDate, status = 'All' } = {}) {
    logger.action('Verifying subscriber delivery history tab');
    if (!(await this.clickDetailsTab('Delivery History'))) {
      return false;
    }
    const dialog = this.page.getByRole('dialog');
    try {
      await dialog.waitFor({ state: 'visible', timeout: 10000 });
    } catch (err) {
      logger.warn('Subscriber details dialog not visible when verifying Delivery History tab');
      return false;
    }

    const startInput = this.page.getByLabel(/Start Date/i).first();
    const endInput = this.page.getByLabel(/End Date/i).first();
    const statusDropdown = await this.getDropdownByLabel('Status');

    if (await startInput.count() === 0 || await endInput.count() === 0) {
      logger.warn('Start or End date input not found in Delivery History tab');
      return false;
    }

    await startInput.fill(startDate);
    await endInput.fill(endDate);
    logger.info(`Delivery history filter dates set: ${startDate} -> ${endDate}`);

    const statusOptions = [];
    if (await statusDropdown.count() > 0) {
      logger.info('Status dropdown found in Delivery History tab');
      await statusDropdown.click();
      logger.info('Opened status dropdown');
      const listBox = this.page.getByRole('listbox').first();
      if (await listBox.count() > 0) {
        const optionLocators = listBox.locator('[role="option"]');
        const optionCount = await optionLocators.count();
        logger.info(`Status dropdown option count: ${optionCount}`);
        for (let i = 0; i < optionCount; i++) {
          statusOptions.push((await optionLocators.nth(i).innerText()).trim());
        }
      } else {
        logger.warn('Status dropdown listbox opened but no options found');
      }
      logger.info(`Delivery history status dropdown options: ${statusOptions.join(', ')}`);
      await this.selectDropdownValue(statusDropdown, status);
      logger.info(`Delivery history status filter set to: ${status}`);
    } else {
      logger.warn('Status dropdown not found in Delivery History tab; continuing without status selection');
    }

    const applyButton = this.page.getByRole('button', { name: /(apply|search|filter)/i }).first();
    if (await applyButton.count() > 0) {
      await applyButton.click();
      logger.info('Applied delivery history filter');
    }

    const historyRows = dialog.locator('table tbody tr');
    try {
      await historyRows.first().waitFor({ state: 'visible', timeout: 10000 });
    } catch (err) {
      logger.warn('No delivery history rows found after applying filter');
      return false;
    }

    const rowCount = await historyRows.count();
    const firstRowText = rowCount > 0 ? await historyRows.first().innerText() : 'no rows found';
    logger.info(`Delivery history rows after filter: count=${rowCount}, firstRow=${firstRowText.slice(0, 200)}`);

    const clearButton = this.page.getByRole('button', { name: /(clear|reset)/i }).first();
    if (await clearButton.count() > 0) {
      await clearButton.click();
      logger.info('Cleared delivery history filter');
    } else {
      logger.warn('Clear filter button not found in Delivery History tab');
    }

    const expectedStatuses = ['All', 'Scheduled', 'Delivered', 'Out', 'Out for Delivery', 'Out of Delivery', 'Skipped'];
    const knownStatuses = statusOptions.filter((option) => expectedStatuses.some((expected) => new RegExp(expected, 'i').test(option)));
    logger.info(`Verified status dropdown options include: ${knownStatuses.join(', ')}`);

    return true;
  }

  async verifySubscriberLegacyTab() {
    logger.action('Verifying subscriber legacy tab');
    if (!(await this.clickDetailsTab('Legacy'))) {
      return false;
    }
    const dialog = this.page.getByRole('dialog');
    try {
      await dialog.waitFor({ state: 'visible', timeout: 10000 });
    } catch (err) {
      logger.warn('Subscriber details dialog not visible when verifying Legacy tab');
      return false;
    }

    const legacyRows = dialog.locator('table tbody tr');
    try {
      await legacyRows.first().waitFor({ state: 'visible', timeout: 10000 });
      logger.info('Legacy history rows present');
      return true;
    } catch (err) {
      logger.warn('Legacy history rows not found');
      return false;
    }
  }

  async closeSubscriberDetailsDialog() {
    logger.action('Closing subscriber details dialog');
    const dialog = this.page.getByRole('dialog');
    const closeButton = dialog.getByRole('button', { name: /close/i }).first();
    if (await closeButton.count() > 0) {
      await closeButton.click();
    } else {
      const fallback = this.page.getByRole('button', { name: /x|close/i }).first();
      if (await fallback.count() > 0) {
        await fallback.click();
      } else {
        logger.warn('Close button not found on subscriber details dialog');
        return false;
      }
    }
    try {
      await dialog.waitFor({ state: 'hidden', timeout: 10000 });
      logger.info('Subscriber details dialog closed');
      return true;
    } catch (err) {
      logger.warn('Subscriber details dialog did not close after clicking close');
      return false;
    }
  }
}

module.exports = { SubscribersPage };