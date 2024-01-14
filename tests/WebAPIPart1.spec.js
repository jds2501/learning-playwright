const {test, expect, request} = require('@playwright/test');
const loginPayload = {userEmail:"descript.linking@gmail.com",userPassword:"Lindy123$"};
let token;

test.beforeAll(async ()=> {
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

    // Print titles on page
    const allTitles = await allTitleContents.locator("b").allTextContents();
    console.log(allTitles);

    // Find the product to buy
    const productName = "ADIDAS ORIGINAL";
    const targetProductIndex = allTitles.indexOf(productName);
    expect(targetProductIndex >= 0).toBeTruthy();

    // Buy the product
    await allTitleContents.nth(targetProductIndex).locator("[style='float: right;']").click();

    // Click the cart page
    await page.locator("[routerlink='/dashboard/cart']").click();

    // Check that the right product is present
    await expect(page.locator(".cartSection h3")).toContainText(productName);

    // Click the checkout button
    await page.getByRole('button', { name: "Checkout"}).click();

    // Make sure the email is pre-populated
    await expect(page.locator("[style='color: lightgray; font-weight: 600;']")).toHaveText(email)

    // Verify product & quantity
    await expect(page.locator(".item__title")).toHaveText(productName);
    await expect(page.locator(".item__quantity")).toContainText("1");

    // Select country for shipping info from pre-populated list
    const shippingCountry = page.locator("[placeholder='Select Country']");
    await shippingCountry.pressSequentially("United");
    const prepopulatedList = page.locator(".ta-item");
    await prepopulatedList.last().waitFor();
    await prepopulatedList.getByText(/.*United States$/).click();

    // Apply coupon
    await page.locator("[name='coupon']").fill("rahulshettyacademy");
    await page.locator("button[type='submit']").click();
    await expect(page.locator(".mt-1.ng-star-inserted")).toContainText("Coupon Applied");

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
        await expect(emailCountry.nth(0)).toContainText(email);
        await expect(emailCountry.nth(1)).toContainText("United States");
    }


});