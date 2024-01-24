const { test, expect, request } = require('@playwright/test');
const { APIUtils } = require('../utils/APIUtils');
const { log } = require('console');
const loginPayload = { userEmail: "descript.linking@gmail.com", userPassword: "Lindy123$" };
const orderPayload = { orders: [{ country: "Cuba", productOrderedId: "6581ca399fd99c85e8ee7f45" }] }
let response;
const urlOverride = "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*";
const fakePayloadOrders = { data: [], message: "No Orders" };

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);
});

test('Place the order', async ({ page }) => {
    // Login
    const email = "descript.linking@gmail.com";
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client");

    await page.route(urlOverride,
        async route => {
            const response = await page.request.fetch(route.request());
            let body = JSON.stringify(fakePayloadOrders);
            route.fulfill({
                response,
                body
            });
            // intercepting the response - API response->{playwright fakeresponse}-->browser->render data on frontend
        });

    // Wait for page to load
    const allTitleContents = page.locator(".card-body");
    await allTitleContents.last().waitFor();

    await page.locator("[routerlink='/dashboard/myorders']").click();
    await page.waitForResponse(urlOverride);
    await expect(page.locator(".mt-4.ng-star-inserted")).toContainText("You have No Orders to show at this time.");
});
