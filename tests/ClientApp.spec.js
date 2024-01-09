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
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill("descript.linking@gmail.com");
    await page.locator("#userPassword").fill("Lindy123$");
    await page.locator("#login").click();

    // Wait for page to load
    const allTitleContents = await page.locator(".card-body");
    await allTitleContents.last().waitFor();

    // 2. Print titles on page
    const allTitles = await allTitleContents.locator("b").allTextContents();
    console.log(allTitles);

    // 3. Find the product to buy
    const targetProductIndex = allTitles.indexOf("ADIDAS ORIGINAL");
    expect(targetProductIndex >= 0).toBeTruthy();

    // 4. Buy the product
    await allTitleContents.nth(targetProductIndex).locator("[style='float: right;']").click();

    // 5. Click the cart page
    await page.locator("[routerlink='/dashboard/cart']").click();

});
