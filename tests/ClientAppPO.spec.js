const {test, expect} = require('@playwright/test');
const { POManager } = require('../pageobjects/POManager');


test('Register Account Interactions', async ({page})=>
{
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator('.btn1').click();
    await page.locator("#firstName").fill("First");
    await page.locator("#lastName").fill("Last");
    await page.locator("[type='checkbox']").click();
});


test('Playwright Practice Exercise', async ({page})=>
{
    const poManager = new POManager(page);

    // Login
    const username = "descript.linking@gmail.com";
    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.validLogin(username, "Lindy123$");
    const dashboardPage = poManager.getDashboardPage();

    const productName = "ADIDAS ORIGINAL";
    expect(await dashboardPage.addToCart(productName)).toBeTruthy();
    await dashboardPage.navigateToCart();
    const cartPage = poManager.getCartPage();

    expect((await cartPage.getProductName()) == productName).toBeTruthy();
    await cartPage.checkout();
    const checkoutPage = poManager.getCheckoutPage();

    expect((await checkoutPage.getShippingEmail()) == username).toBeTruthy();
    expect(await checkoutPage.verifyProductAndQuantity(productName, "1")).toBeTruthy();

    // Select country for shipping info from pre-populated list
    const countryName = "United States";
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
    expect(await orderSummaryPage.verifyProductName(productName)).toBeTruthy();
    expect(await orderSummaryPage.verifyAddresses(username, countryName)).toBeTruthy();
});
