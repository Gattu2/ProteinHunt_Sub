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
    await this.page.waitForTimeout(2000);
    const saveBtn = this.page.getByRole('button', { name: /save|update|submit/i }).first();
    if (await saveBtn.count() > 0) {
      await this.page.waitForTimeout(1000);
      await saveBtn.click();
      logger.info('Clicked Save on Instruction page');
      await this.page.waitForTimeout(1000);
      return true;
    }
    logger.warn('Save button not found on Instruction page');
    return false;
  }
}

module.exports = { InstructionPage };