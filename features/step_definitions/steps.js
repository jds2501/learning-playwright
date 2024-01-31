const { Given, When, Then } = require('@cucumber/cucumber');
const { POManager } = require('../../pageobjects/POManager');
const { expect } = require('@playwright/test');
const playwright = require('@playwright/test');

Given('a login to Ecommerce application with {string} and {string}', {timeout: 100 * 1000}, async function (username, password) {
    const browser = await playwright.chromium.launch({headless: false}); 
    const context = await browser.newContext();
    const page = await context.newPage(); 
    this.poManager = new POManager(page);    
    this.username = username;
    const loginPage = this.poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.validLogin(username, password);
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