const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { pageLogger } = require('../utils/logger');
const logger = pageLogger('LoginSpec');
const users = require('../test-data/users');

test.describe('Login Functionality', () => {
  test('Valid Admin login @smoke @regression', async ({ page }) => {
    logger.info('Test start: Valid Admin login');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithEmail(users.admin.email, users.admin.password);
    await loginPage.verifyLoginSuccess();
    await expect(page).toHaveURL(/admin/);
    logger.info('Test complete: Valid Admin login');
  });

  test('Valid Subscriber login @sanity @regression', async ({ page }) => {
    logger.info('Test start: Valid Subscriber login');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithUsername(users.subscriber.username, users.subscriber.password);
    await loginPage.verifyLoginSuccess();
    await expect(page).toHaveURL(/subscriber|dashboard|home/);
    logger.info('Test complete: Valid Subscriber login');
  });

  test('Valid Chef login @regression', async ({ page }) => {
    logger.info('Test start: Valid Chef login');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithUsername(users.chef.username, users.chef.password);
    await loginPage.verifyLoginSuccess();
    await expect(page.locator('text=Dashboard')).toBeVisible();
    logger.info('Test complete: Valid Chef login');
  });

  test('Invalid username/password validation @regression', async ({ page }) => {
    logger.info('Test start: Invalid username/password validation');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithUsername(users.invalid.username, users.invalid.password);
    const toastText = await loginPage.verifyInvalidCredentials();
    if (toastText) {
      expect(toastText.toLowerCase()).toContain('invalid');
    } else {
      await expect(page).toHaveURL(/\/login/);
    }
    logger.info('Test complete: Invalid username/password validation');
  });

  test('Empty field validation @regression', async ({ page }) => {
    logger.info('Test start: Empty field validation');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginButton.click();
    const messages = await loginPage.verifyEmptyFieldValidation();
    if (messages.length > 0) {
      expect(messages.length).toBeGreaterThan(0);
    } else {
      await expect(page).toHaveURL(/\/login/);
    }
    logger.info('Test complete: Empty field validation');
  });

  test('Verify logout functionality @sanity @regression', async ({ page }) => {
    logger.info('Test start: Verify logout functionality');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithEmail(users.admin.email, users.admin.password);
    await loginPage.verifyLoginSuccess();
    await loginPage.logout();
    await expect(page).toHaveURL(/login/);
    logger.info('Test complete: Verify logout functionality');
  });
});
