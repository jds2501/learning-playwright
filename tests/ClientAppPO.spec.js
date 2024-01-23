const {test, expect} = require('@playwright/test');
const { LoginPage } = require('../pageobjects/LoginPage');


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
    // Login
    const username = "descript.linking@gmail.com";
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    const dashboardPage = await loginPage.validLogin(username, "Lindy123$");

    const productName = "ADIDAS ORIGINAL";
    expect(await dashboardPage.addToCart(productName)).toBeTruthy();
    const cartPage = await dashboardPage.navigateToCart();

    expect((await cartPage.getProductName()) == productName).toBeTruthy();
    const checkoutPage = await cartPage.checkout();

    expect((await checkoutPage.getShippingEmail()) == username).toBeTruthy();
    expect(await checkoutPage.verifyProductAndQuantity(productName, "1")).toBeTruthy();

    // Select country for shipping info from pre-populated list
    const countryName = "United States";
    await checkoutPage.selectShippingCountry(countryName);

    expect(await checkoutPage.applyCoupon("rahulshettyacademy")).toBeTruthy();

    // Place order
    const orderThanksPage = await checkoutPage.placeOrder();
    expect(await orderThanksPage.verifyThankYou()).toBeTruthy();

    // Extract order ID & load order history page
    const orderID = await orderThanksPage.getOrderID();
    expect(orderID).toBeTruthy();
    const myOrdersPage = await orderThanksPage.openOrderHistoryPage();

    // Check order ID on order history page
    myOrdersPage.viewOrder(orderID[0]);

    // Check order ID, product name, and billing / delivery address titles on order summary page
    await expect(page.locator(".col-text.-main")).toHaveText(orderID[0]);
    await expect(page.locator(".title")).toHaveText(productName);
    const orderSummaryAddresses = page.locator(".address");
    expect(await orderSummaryAddresses.count()).toEqual(2);
    await expect(orderSummaryAddresses.nth(0).locator(".content-title")).toContainText("Billing Address");
    await expect(orderSummaryAddresses.nth(1).locator(".content-title")).toContainText("Delivery Address");

    // Check that email & countries are correct on order summary page
    for (let i = 0; i < 2; i++){
        const emailCountry = orderSummaryAddresses.nth(i).locator(".text");
        expect(await emailCountry.count()).toEqual(2);
        await expect(emailCountry.nth(0)).toContainText(username);
        await expect(emailCountry.nth(1)).toContainText(countryName);
    }


});
