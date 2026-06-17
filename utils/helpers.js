const { faker } = require('@faker-js/faker');

const waitForNetworkIdle = async (page, timeout = 15000) => {
  await page.waitForLoadState('networkidle', { timeout });
};

const safeClick = async (locator) => {
  await locator.waitFor({ state: 'visible', timeout: 10000 });
  await locator.click();
};

const safeFill = async (locator, value) => {
  await locator.waitFor({ state: 'visible', timeout: 10000 });
  await locator.fill(value);
};

const generateRandomEmail = () => faker.internet.email();

const generateRandomName = () => faker.person.fullName();

const generateRandomPhone = () => faker.phone.number('##########');

module.exports = {
  waitForNetworkIdle,
  safeClick,
  safeFill,
  generateRandomEmail,
  generateRandomName,
  generateRandomPhone
};
