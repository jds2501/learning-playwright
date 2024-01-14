const {test, expect, request} = require('@playwright/test');
const loginPayload = {userEmail:"descript.linking@gmail.com",userPassword:"Lindy123$"};
const orderPayload = {orders: [{country: "Cuba", productOrderedId: "6581ca399fd99c85e8ee7f45"}]}
let token;
let orderID;

test.beforeAll(async ()=> {
    // Login API
   const apiContext = await request.newContext();
   const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", 
   {
        data: loginPayload
    });

    // Expecting HTTP 200, 201 code
    expect(loginResponse.ok()).toBeTruthy();

    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;
    console.log(token);

    const orderResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
    {
        data: orderPayload,
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    });
    const orderResponseJson = await orderResponse.json();
    console.log(orderResponseJson);
    orderID = orderResponseJson.orders[0];
});

test('Place the order', async ({page})=>
{
    // Login
    const email = "descript.linking@gmail.com";
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token );

    await page.goto("https://rahulshettyacademy.com/client");

    // Wait for page to load
    const allTitleContents = page.locator(".card-body");
    await allTitleContents.last().waitFor();

    const productName = "ZARA COAT 3";

    // Print titles on page
    const allTitles = await allTitleContents.locator("b").allTextContents();
    console.log(allTitles);

    expect(orderID).toBeTruthy();
    await page.locator("[routerlink='/dashboard/myorders']").click();

    // Check order ID on order history page
    const orderHistoryRows = page.locator("tbody .ng-star-inserted");
    await orderHistoryRows.last().waitFor();
    const orderHistoryIDs = await page.locator("[scope='row']").allTextContents();
    const orderHistoryIDIndex = orderHistoryIDs.indexOf(orderID);
    expect(orderHistoryIDIndex >= 0).toBeTruthy();
    await orderHistoryRows.nth(orderHistoryIDIndex).locator(".btn.btn-primary").click();

    // Check order ID, product name, and billing / delivery address titles on order summary page
    await expect(page.locator(".col-text.-main")).toHaveText(orderID);
    await expect(page.locator(".title")).toHaveText(productName);
    const orderSummaryAddresses = page.locator(".address");
    expect(await orderSummaryAddresses.count()).toEqual(2);
    await expect(orderSummaryAddresses.nth(0).locator(".content-title")).toContainText("Billing Address");
    await expect(orderSummaryAddresses.nth(1).locator(".content-title")).toContainText("Delivery Address");

    // Check that email & countries are correct on order summary page
    for (let i = 0; i < 2; i++){
        const emailCountry = orderSummaryAddresses.nth(i).locator(".text");
        expect(await emailCountry.count()).toEqual(2);
        await expect(emailCountry.nth(0)).toContainText(email);
        await expect(emailCountry.nth(1)).toContainText("Cuba");
    }


});
