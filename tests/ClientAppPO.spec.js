const { test, expect } = require('@playwright/test');
const { customtest } = require('../utils/test-base');
const { POManager } = require('../pageobjects/POManager');
const dataset = JSON.parse(JSON.stringify(require("../utils/placeorderTestData.json")));


test('Register Account Interactions', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator('.btn1').click();
    await page.locator("#firstName").fill("First");
    await page.locator("#lastName").fill("Last");
    await page.locator("[type='checkbox']").click();
});


for (const data of dataset) {

    test(`@Web Playwright Practice Exercise for ${data.productName}`, async ({ page }) => {
        const poManager = new POManager(page);
        const countryName = "United States";

        const loginPage = poManager.getLoginPage();
        await loginPage.goTo();
        await loginPage.validLogin(data.username, data.password);

        const dashboardPage = poManager.getDashboardPage();
        expect(await dashboardPage.addToCart(data.productName)).toBeTruthy();
        await dashboardPage.navigateToCart();

        const cartPage = poManager.getCartPage();
        expect((await cartPage.getProductName()) == data.productName).toBeTruthy();
        await cartPage.checkout();

        const checkoutPage = poManager.getCheckoutPage();
        expect((await checkoutPage.getShippingEmail()) == data.username).toBeTruthy();
        expect(await checkoutPage.verifyProductAndQuantity(data.productName, "1")).toBeTruthy();

        // Select country for shipping info from pre-populated list
        await checkoutPage.selectShippingCountry(countryName);
        expect(await checkoutPage.applyCoupon("rahulshettyacademy")).toBeTruthy();

        // Place order
        await checkoutPage.placeOrder();
        const orderThanksPage = poManager.getOrderThanksPage();
        expect(await orderThanksPage.verifyThankYou()).toBeTruthy();

        // Extract order ID & load order history page
        const orderID = await orderThanksPage.getOrderID();
        expect(orderID).toBeTruthy();
        await orderThanksPage.openOrderHistoryPage();
        const myOrdersPage = poManager.getMyOrdersPage();

        // Check order ID on order history page
        await myOrdersPage.viewOrder(orderID[0]);
        const orderSummaryPage = poManager.getOrderSummaryPage();

        // Check order ID, product name, and billing / delivery address titles on order summary page
        expect(await orderSummaryPage.verifyOrderID(orderID[0])).toBeTruthy();
        expect(await orderSummaryPage.verifyProductName(data.productName)).toBeTruthy();
        expect(await orderSummaryPage.verifyAddresses(data.username, countryName)).toBeTruthy();
    });

}


customtest(`Playwright Practice Exercise`, async ({ page, testDataForOrder }) => {
    const poManager = new POManager(page);
    const countryName = "United States";

    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.validLogin(testDataForOrder.username, testDataForOrder.password);
    const dashboardPage = poManager.getDashboardPage();

    expect(await dashboardPage.addToCart(testDataForOrder.productName)).toBeTruthy();
    await dashboardPage.navigateToCart();
    const cartPage = poManager.getCartPage();

    expect((await cartPage.getProductName()) == testDataForOrder.productName).toBeTruthy();
    await cartPage.checkout();
})