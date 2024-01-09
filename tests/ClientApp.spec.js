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

    // 3. Find the specific product to buy
    const allTitleContents = await page.locator(".card-body b");
    const desiredProduct = await allTitleContents.getByText("ADIDAS ORIGINAL");
    await desiredProduct.waitFor();

    // 2. Print titles on page
    const allTitles = await allTitleContents.allTextContents();
    console.log(allTitles);
});
