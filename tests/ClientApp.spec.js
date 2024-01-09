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

    //Check last item in list is there post login
    const allTitleContents = await page.locator(".card-body b");
    await allTitleContents.last().waitFor();

    // 2. Print titles on page
    const allTitles = await allTitleContents.allTextContents();
    console.log(allTitles);

    // 3. Find the specific product to buy
    const desiredProductName = "ADIDAS ORIGINAL"
    let targetProduct = undefined;
    for (let i = 0; i < await allTitleContents.count() && targetProduct == undefined; i++){
        if (await allTitleContents.nth(i).textContent() == desiredProductName){
            targetProduct = allTitleContents.nth(i);
        }
    }
    await expect(await targetProduct != undefined).toBeTruthy();

});
