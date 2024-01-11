const {test, expect} = require('@playwright/test');

test('Register Account Interactions', async ({page})=>
{
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator('.btn1').click();
    await page.locator("#firstName").fill("First");
    await page.locator("#lastName").fill("Last");
    await page.locator("[type='checkbox']").click();
});


test('Login Test', async ({page})=>
{
    // Login
    const email = "descript.linking@gmail.com";
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("Lindy123$");
    await page.locator("#login").click();

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

});
