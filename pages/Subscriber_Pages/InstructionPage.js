const { pageLogger } = require('../../utils/logger');
const logger = pageLogger('InstructionPage');

class InstructionPage {
  constructor(page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: /instruction/i });
    logger.info('InstructionPage initialized');
  }

  async verifyLoaded() {
    logger.info('Verifying Instruction page loaded');
    await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
    logger.info('Instruction page loaded');
  }

  async addInstructions(text) {
    logger.action('Adding instructions on Instruction page');
    const textarea = this.page.locator('textarea, #instructions, [name="instructions"]').first();
    if (await textarea.count() === 0) {
      logger.warn('Instructions textarea not found');
      return false;
    }
    await textarea.fill(text);
    logger.info(`Filled instructions: ${text.slice(0,120)}`);
    const saveBtn = this.page.getByRole('button', { name: /save|update|submit/i }).first();
    if (await saveBtn.count() > 0) {
      const enabledAfterFill = await saveBtn.isEnabled().catch(() => false);
      if (!enabledAfterFill) {
        // Some builds keep save disabled until a detectable change/blur occurs.
        await textarea.press('End').catch(() => {});
        await textarea.type(' ').catch(() => {});
        await textarea.press('Backspace').catch(() => {});
        await textarea.blur().catch(() => {});
        await this.page.waitForTimeout(500);
      }

      const enabled = await saveBtn.isEnabled().catch(() => false);
      if (!enabled) {
        const currentValue = await textarea.inputValue().catch(() => '');
        if (currentValue && currentValue.includes(text.trim())) {
          logger.info('Save button is disabled, but instructions are already present');
          return true;
        }
        logger.warn('Save button remains disabled after editing instructions');
        return false;
      }

      await saveBtn.click();
      logger.info('Clicked Save on Instruction page');
      await this.page.waitForTimeout(800);
      return true;
    }
    logger.warn('Save button not found on Instruction page');
    return false;
  }
}

module.exports = { InstructionPage };