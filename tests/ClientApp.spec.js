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
    // 1. Login
    const email = "descript.linking@gmail.com";
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("Lindy123$");
    await page.locator("#login").click();

    // Wait for page to load
    const allTitleContents = await page.locator(".card-body");
    await allTitleContents.last().waitFor();

    // 2. Print titles on page
    const allTitles = await allTitleContents.locator("b").allTextContents();
    console.log(allTitles);

    // 3. Find the product to buy
    const productName = "ADIDAS ORIGINAL";
    const targetProductIndex = allTitles.indexOf(productName);
    expect(targetProductIndex >= 0).toBeTruthy();

    // 4. Buy the product
    await allTitleContents.nth(targetProductIndex).locator("[style='float: right;']").click();

    // 5. Click the cart page
    await page.locator("[routerlink='/dashboard/cart']").click();

    // 6. Check that the right product is present
    await expect(page.locator(".cartSection h3")).toContainText(productName);

    // 7. Click the checkout button
    await page.getByRole('button', { name: "Checkout"}).click();

    // 8. Make sure the email is pre-populated
    await expect(page.locator("[style='color: lightgray; font-weight: 600;']")).toHaveText(email)

    // 9. Verify product & quantity
    await expect(page.locator(".item__title")).toHaveText(productName);
    await expect(page.locator(".item__quantity")).toContainText("1");

    // 10. Select country for shipping info from pre-populated list
    const shippingCountry = page.locator("[placeholder='Select Country']");
    await shippingCountry.pressSequentially("United");
    const prepopulatedList = page.locator(".ta-item");
    await prepopulatedList.last().waitFor();
    await prepopulatedList.getByText(/.*United States$/).click();

    // 11. Apply coupon
    await page.locator("[name='coupon']").fill("rahulshettyacademy");
    await page.locator("button[type='submit']").click();
    await expect(page.locator(".mt-1.ng-star-inserted")).toContainText("Coupon Applied");
});
