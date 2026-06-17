const { test: baseTest } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { pageLogger } = require('../utils/logger');
const logger = pageLogger('AuthFixtures');
const users = require('../test-data/users');

const test = baseTest.extend({
  loginPage: async ({ page }, use) => {
    logger.info('Creating loginPage fixture');
    await use(new LoginPage(page));
  },
  users: async ({}, use) => {
    await use(users);
  },
  loginAsAdmin: async ({ loginPage, users }, use) => {
    logger.info(`Fixture action: logging in as admin (${users.admin.email})`);
    await loginPage.goto();
    await loginPage.loginWithEmail(users.admin.email, users.admin.password);
    await loginPage.verifyLoginSuccess();
    await use();
  },
  loginAsSubscriber: async ({ loginPage, users }, use) => {
    logger.info(`Fixture action: logging in as subscriber (${users.subscriber.username})`);
    await loginPage.goto();
    await loginPage.loginWithUsername(users.subscriber.username, users.subscriber.password);
    await loginPage.verifyLoginSuccess();
    await use();
  },
  loginAsChef: async ({ loginPage, users }, use) => {
    logger.info(`Fixture action: logging in as chef (${users.chef.username})`);
    await loginPage.goto();
    await loginPage.loginWithUsername(users.chef.username, users.chef.password);
    await loginPage.verifyLoginSuccess();
    await use();
  }
});

module.exports = { test, expect: baseTest.expect };
