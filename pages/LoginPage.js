const { pageLogger } = require('../utils/logger');
const logger = pageLogger('LoginPage');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Enter your username');
    this.passwordInput = page.getByPlaceholder('Enter your password');
    this.loginButton = page.getByRole('button', { name: /sign in|login/i });
    this.logoutButton = page.getByRole('button', { name: /logout/i });
    this.toastMessage = page.locator('[role="alert"], .toast-message, .toast, .notification, .alert, .message, .error-message, .form-error');
    this.validationMessage = page.locator('.field-error, .invalid-feedback, .error-message, .error, .form-error, .input-error, .validation-message');
    logger.info('LoginPage initialized');
  }

  async goto() {
    logger.info('Navigating to login page');
    await this.page.goto('/login');
    await this.usernameInput.waitFor({ state: 'visible', timeout: 20000 });
    logger.info('Login page loaded successfully');
  }

  async loginWithEmail(email, password) {
    logger.action(`Typing email: ${email}`);
    await this.usernameInput.fill(email);
    logger.action('Typing password');
    await this.passwordInput.fill(password);
    logger.action('Clicking login button');
    await this.loginButton.click();
  }

  async loginWithUsername(username, password) {
    logger.action(`Typing username: ${username}`);
    await this.usernameInput.fill(username);
    logger.action('Typing password');
    await this.passwordInput.fill(password);
    logger.action('Clicking login button');
    await this.loginButton.click();
  }

  async verifyLoginSuccess() {
    logger.info('Verifying successful login');
    await this.page.waitForURL(/(dashboard|admin|subscriber|chef)/, { timeout: 20000 });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 20000 });
    logger.info('Login success verified');
  }

  async verifyInvalidCredentials() {
    logger.info('Checking invalid credentials feedback');
    const toast = this.toastMessage.first();
    const fallback = this.page.getByText(/invalid|incorrect|failed|unauthorized|wrong|error/i);
    if (await toast.count() > 0) {
      await toast.waitFor({ timeout: 10000 });
      const text = await toast.textContent();
      logger.info(`Invalid credentials message found: ${text}`);
      return text;
    }
    if (await fallback.count() > 0) {
      await fallback.waitFor({ timeout: 10000 });
      const text = await fallback.textContent();
      logger.info(`Invalid credentials fallback message found: ${text}`);
      return text;
    }
    logger.warn('No invalid credentials message was found');
    return null;
  }

  async verifyEmptyFieldValidation() {
    logger.info('Checking empty field validation messages');
    const validation = this.validationMessage.first();
    const fallback = this.page.getByText(/required|please enter|cannot be empty|username is required|password is required/i);
    if (await validation.count() > 0) {
      await validation.waitFor({ timeout: 10000 });
      const texts = await this.validationMessage.allTextContents();
      logger.info(`Validation messages found: ${JSON.stringify(texts)}`);
      return texts;
    }
    if (await fallback.count() > 0) {
      await fallback.waitFor({ timeout: 10000 });
      const text = await fallback.textContent();
      logger.info(`Validation fallback message found: ${text}`);
      return [text];
    }
    logger.warn('No empty field validation message was found');
    return [];
  }

  async logout() {
    logger.action('Clicking logout button');
    await this.logoutButton.click();
    await this.page.waitForURL('**/login', { timeout: 20000 });
    logger.info('Logout completed successfully');
  }
}

module.exports = { LoginPage };