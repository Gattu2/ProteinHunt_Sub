const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { verifyToastContains, verifyNoLoader } = require('../utils/validators');
const { pageLogger } = require('../utils/logger');
const logger = pageLogger('ValidationSpec');
const users = require('../test-data/users');

test.describe('Common Validations', () => {
  test('Verify toast messaging on invalid login @regression', async ({ page }) => {
    logger.info('Test start: Verify toast messaging on invalid login');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithUsername(users.invalid.username, users.invalid.password);
    await verifyToastContains(page, 'invalid');
    logger.info('Test complete: Verify toast messaging on invalid login');
  });

  test('Verify loader disappears after login attempt @regression', async ({ page }) => {
    logger.info('Test start: Verify loader disappears after login attempt');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithUsername(users.invalid.username, users.invalid.password);
    await verifyNoLoader(page);
    logger.info('Test complete: Verify loader disappears after login attempt');
  });

  test('Verify responsive layout on mobile viewport @sanity', async ({ browser }) => {
    logger.info('Test start: Verify responsive layout on mobile viewport');
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.loginButton).toBeVisible();
    await context.close();
    logger.info('Test complete: Verify responsive layout on mobile viewport');
  });
});
