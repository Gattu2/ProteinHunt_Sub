const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/Admin_Pages/DashboardPage');
const { MenuItemsPage } = require('../pages/Admin_Pages/MenuItemsPage');
const { MenuPage } = require('../pages/Admin_Pages/MenuPage');
const { pageLogger } = require('../utils/logger');
const logger = pageLogger('AdminTest');
const users = require('../test-data/users');

test.describe('Admin Module', () => {
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    logger.info('Admin Module beforeEach: login as admin');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithEmail(users.admin.email, users.admin.password);
    await loginPage.verifyLoginSuccess();
  });

  test('Verify admin pages are accessible and logout works @smoke @regression', async ({ page }) => {
    logger.info('Test start: Verify admin pages are accessible and logout works');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.verifyLoaded();

    await dashboardPage.navigateToSubscribers();
    await expect(page).toHaveURL(/\/admin\/users(\/|$)/);

    await dashboardPage.navigateToDeliveries();
    await expect(page).toHaveURL(/\/admin\/deliveries(\/|$)/);

    await dashboardPage.navigateToRequests();
    await expect(page).toHaveURL(/\/admin\/change-requests(\/|$)/);

    await dashboardPage.navigateToMenuItems();
    await expect(page).toHaveURL(/\/admin\/menu(\/|$)/);

    await dashboardPage.navigateToMenu();
    await expect(page).toHaveURL(/\/admin\/weekly-menus(\/|$)/);

    await dashboardPage.navigateToTimeSlots();
    await expect(page).toHaveURL(/\/admin\/time-slots(\/|$)/);

    await dashboardPage.navigateToKitchen();
    await expect(page).toHaveURL(/\/admin\/kitchens(\/|$)/);

    await dashboardPage.logout();
    await expect(page).toHaveURL(/login/);
    logger.info('Test complete: Verify admin pages are accessible and logout works');
  });

  test('Verify admin menu items flows', async ({ page }) => {
    logger.info('Test start: Verify admin menu items flows');
    const dashboardPage = new DashboardPage(page);
    const menuItemsPage = new MenuItemsPage(page);

    await dashboardPage.verifyLoaded();
    await dashboardPage.navigateToMenuItems();
    await menuItemsPage.verifyLoaded();

    const timestamp = Date.now();
    const vegItem = { menuType: 'Veg', name: `Veg Lentil Bowl ${timestamp}`, description: 'A healthy vegetarian bowl', calories: 250, protein: 12, carbs: 28, fat: 8, ingredients: 'Lentils, tomato, onion, spices' };
    const vegEggItem = { menuType: 'Veg & Egg', name: `Veg Egg Scramble ${timestamp}`, description: 'Veg and egg breakfast option', calories: 220, protein: 15, carbs: 18, fat: 10, ingredients: 'Egg, spinach, bell pepper, olive oil' };
    const nonVegItem = { menuType: 'Non-Veg', name: `Chicken Curry ${timestamp}`, description: 'Spicy non-veg curry', calories: 320, protein: 24, carbs: 20, fat: 14, ingredients: 'Chicken, onion, tomato, spices' };

    await menuItemsPage.addMenuItem(vegItem);
    await menuItemsPage.addMenuItem(vegEggItem);
    await menuItemsPage.addMenuItem(nonVegItem);

    expect(await menuItemsPage.isMenuItemPresent(vegItem.name, vegItem.menuType)).toBeTruthy();
    expect(await menuItemsPage.isMenuItemPresent(vegEggItem.name, vegEggItem.menuType)).toBeTruthy();
    expect(await menuItemsPage.isMenuItemPresent(nonVegItem.name, nonVegItem.menuType)).toBeTruthy();

    const updatedVegName = `${vegItem.name} Updated`;
    await menuItemsPage.updateMenuItem(vegItem.name, { name: updatedVegName, description: 'Updated vegetarian bowl description' }, vegItem.menuType);
    expect(await menuItemsPage.isMenuItemPresent(updatedVegName, vegItem.menuType)).toBeTruthy();

    await menuItemsPage.deleteMenuItem(nonVegItem.name, nonVegItem.menuType);
    // expect(await menuItemsPage.isMenuItemPresent(nonVegItem.name, nonVegItem.menuType)).toBeFalsy();

    logger.info('Test complete: Verify admin menu items flows');
  });

  test('Verify admin weekly menus flows', async ({ page }) => {
    logger.info('Test start: Verify admin weekly menus flows');
    const dashboardPage = new DashboardPage(page);
    const menuPage = new MenuPage(page);

    await dashboardPage.verifyLoaded();
    await dashboardPage.navigateToMenu();
    await menuPage.verifyLoaded();

    const timestamp = Date.now();
    const vegMenu = `Veg Menu ${timestamp}`;
    const vegEggMenu = `Veg & Egg Menu ${timestamp}`;
    const nonVegMenu = `NonVeg Menu ${timestamp}`;

    await menuPage.createMenu(vegMenu, 'Veg');
    await menuPage.createMenu(vegEggMenu, 'Veg & Egg');
    await menuPage.createMenu(nonVegMenu, 'Non-Veg');

    expect(await menuPage.isMenuPresent(vegMenu)).toBeTruthy();
    expect(await menuPage.isMenuPresent(vegEggMenu)).toBeTruthy();
    expect(await menuPage.isMenuPresent(nonVegMenu)).toBeTruthy();

    await menuPage.addMealsToMenu(vegMenu, {
      Breakfast: 'Idli and Sambar',
      Lunch: 'Mixed Vegetable Curry',
      Snacks: 'Fruit Salad',
      Dinner: 'Paneer Bhurji',
    });

    const vegMenuCopy = `${vegMenu} Copy`;
    await menuPage.copyMenu(vegMenu, vegMenuCopy);
    expect(await menuPage.isMenuPresent(vegMenuCopy)).toBeTruthy();

    await menuPage.deleteMenu(vegMenuCopy);
    expect(await menuPage.isMenuPresent(vegMenuCopy)).toBeFalsy();

    await menuPage.deleteMenu(vegMenu);
    await menuPage.deleteMenu(vegEggMenu);
    await menuPage.deleteMenu(nonVegMenu);

    logger.info('Test complete: Verify admin weekly menus flows');
  });
});
