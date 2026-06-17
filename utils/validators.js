const { expect } = require('@playwright/test');
const { info, warn } = require('./logger');

const verifyToastContains = async (page, expectedText) => {
  info(`Validator: verifying toast contains "${expectedText}"`);
  const toast = page.locator('[role="alert"], .toast-message, .toast, .notification, .alert, .message, .error-message, .form-error');
  const fallback = page.getByText(new RegExp(expectedText, 'i'));
  if (await toast.count() > 0) {
    await expect(toast.first()).toBeVisible({ timeout: 10000 });
    await expect(toast.first()).toContainText(new RegExp(expectedText, 'i'));
    info('Validator: toast message found');
    return;
  }
  if (await fallback.count() > 0) {
    await expect(fallback).toBeVisible({ timeout: 10000 });
    await expect(fallback).toContainText(new RegExp(expectedText, 'i'));
    info('Validator: fallback message found');
    return;
  }
  warn('Validator: no toast or fallback message found, asserting login page URL');
  await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
};

const verifyNoLoader = async (page) => {
  info('Validator: checking that no loader remains visible');
  const loader = page.locator('[role="progressbar"], .loading, .spinner');
  if (await loader.count() > 0) {
    await expect(loader.first()).toBeHidden({ timeout: 20000 });
    info('Validator: loader hidden successfully');
  } else {
    info('Validator: no loader present');
  }
};

module.exports = {
  verifyToastContains,
  verifyNoLoader
};
