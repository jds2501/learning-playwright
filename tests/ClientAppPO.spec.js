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
    await page.locator(".btnn.action__submit.ng-star-inserted").click();
    await expect(page.locator(".hero-primary")).toContainText("Thankyou for the order.");

    // Extract order ID & load order history page
    const orderIDText = await page.locator("label[class='ng-star-inserted']").textContent();
    const orderID = orderIDText.match(/[a-z0-9]+/);
    expect(orderID).toBeTruthy();
    await page.locator("label[routerlink='/dashboard/myorders']").click();

    // Check order ID on order history page
    const orderHistoryRows = page.locator("tbody .ng-star-inserted");
    await orderHistoryRows.last().waitFor();
    const orderHistoryIDs = await page.locator("[scope='row']").allTextContents();
    const orderHistoryIDIndex = orderHistoryIDs.indexOf(orderID[0]);
    expect(orderHistoryIDIndex >= 0).toBeTruthy();
    await orderHistoryRows.nth(orderHistoryIDIndex).locator(".btn.btn-primary").click();

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
        await expect(emailCountry.nth(1)).toContainText("United States");
    }


});
