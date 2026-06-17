const { chromium } = require('playwright');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/Admin_Pages/DashboardPage');
const { SubscribersPage } = require('./pages/Admin_Pages/SubscribersPage');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ baseURL: 'https://testsub.proteinhunt.in' });
  try {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const subscribersPage = new SubscribersPage(page);
    await loginPage.goto();
    await loginPage.loginWithEmail('hemanthnalla1@gmail.com', 'Rgukt@123');
    await loginPage.verifyLoginSuccess();
    await dashboardPage.verifyLoaded();
    await dashboardPage.navigateToSubscribers();
    await subscribersPage.verifyLoaded();
    await subscribersPage.openAddSubscriberModal();
    await subscribersPage.verifyAddSubscriberModal();
    const newSubscriber = {
      username: `refreshdebug${Date.now()}`,
      fullName: 'Refresh Debug',
      password: 'Password!2345',
      phone: '9876543210',
      menuType: 'Veg',
      weeklyMenu: 'May 2026 - Veg (Veg)',
      totalMeals: '60',
      subscriptionStartDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      address: '123 Test Lane',
      deliveryDays: ['Mon', 'Wed', 'Fri'],
      deliverySlots: ['Breakfast', 'Dinner'],
      timeSlots: {
        Breakfast: 'Slot 1 - Morning (08:00 - 09:30)',
        Dinner: 'Slot 3 - Evening (16:30 - 17:30)',
      },
    };
    await subscribersPage.fillNewSubscriber(newSubscriber);
    await subscribersPage.createSubscriber();
    await page.reload();
    await subscribersPage.verifyLoaded();
    console.log('new subscriber present after reload', await subscribersPage.isSubscriberPresent(newSubscriber.username));
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();