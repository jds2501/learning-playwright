const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('a login to Ecommerce application with {string} and {string}', { timeout: 100 * 1000 }, async function (username, password) {
    this.username = username;
    const loginPage = this.poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.validLogin(username, password);
});

Given('a login to Ecommerce2 application with {string} and {string}', async function (username, password) {
    const usernameField = this.page.locator('#username');
    const signInBtn = this.page.locator("#signInBtn");
    await this.page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await this.page.title());
    await usernameField.fill(username);
    await this.page.locator("[type='password']").fill(password);
    await signInBtn.click();
});

Then('Verify Error message is displayed', async function () {
    console.log(await this.page.locator("[style*='block']").textContent());
    await expect(this.page.locator("[style*='block']")).toContainText('Incorrect');
});

When('Add {string} to Cart', async function (productName) {
    const dashboardPage = this.poManager.getDashboardPage();
    expect(await dashboardPage.addToCart(productName)).toBeTruthy();
    await dashboardPage.navigateToCart();
    this.productName = productName;
});

Then('Verify {string} is displayed in the Cart', async function (productName) {
    const cartPage = this.poManager.getCartPage();
    expect((await cartPage.getProductName()) == productName).toBeTruthy();
    await cartPage.checkout();
});

When('Enter valid details with {string} and Place the order', async function (countryName) {
    const checkoutPage = this.poManager.getCheckoutPage();
    expect((await checkoutPage.getShippingEmail()) == this.username).toBeTruthy();
    expect(await checkoutPage.verifyProductAndQuantity(this.productName, "1")).toBeTruthy();

    // Select country for shipping info from pre-populated list
    await checkoutPage.selectShippingCountry(countryName);
    expect(await checkoutPage.applyCoupon("rahulshettyacademy")).toBeTruthy();

    // Place order
    await checkoutPage.placeOrder();
});

Then('Verify order in present in the OrderHistory', async function () {
    const orderThanksPage = this.poManager.getOrderThanksPage();
    expect(await orderThanksPage.verifyThankYou()).toBeTruthy();

    // Extract order ID & load order history page
    const orderID = await orderThanksPage.getOrderID();
    expect(orderID).toBeTruthy();
    await orderThanksPage.openOrderHistoryPage();
    const myOrdersPage = this.poManager.getMyOrdersPage();

    // Check order ID on order history page
    await myOrdersPage.viewOrder(orderID[0]);
});