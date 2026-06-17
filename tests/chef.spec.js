const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ChefDashboardPage } = require('../pages/Chef_Pages/ChefDashboardPage');
const { MealPrepPage } = require('../pages/Chef_Pages/MealPrepPage');
const { pageLogger } = require('../utils/logger');
const logger = pageLogger('ChefTest');
const users = require('../test-data/users');

test.describe('Chef Module', () => {
  test.beforeEach(async ({ page }) => {
    logger.info('Chef Module beforeEach: login as chef');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithUsername(users.chef.username, users.chef.password);
    await loginPage.verifyLoginSuccess();
  });

  test('Verify chef navigation and logout @regression', async ({ page }) => {
    logger.info('Test start: Verify chef navigation and logout');
    const dashboardPage = new ChefDashboardPage(page);
    await dashboardPage.verifyLoaded();

    await dashboardPage.navigateToMealPrep();
    const mealPrepPage = new MealPrepPage(page);
    await mealPrepPage.verifyLoaded();

    await dashboardPage.logout();
    await expect(page).toHaveURL(/login/);
    logger.info('Test complete: Verify chef navigation and logout');
  });
});
