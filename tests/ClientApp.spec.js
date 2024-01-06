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
    //Login
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill("descript.linking@gmail.com");
    await page.locator("#userPassword").fill("Lindy123$");
    await page.locator("#login").click();

    //Check first item in list is there post login
    const allTitleContents = await page.locator(".card-body b");
    await allTitleContents.last().waitFor();
    let targetProduct = undefined;

    for (let i = 0; i < await allTitleContents.count() && targetProduct == undefined; i++){
        if (await allTitleContents.nth(i).textContent() == "ADIDAS ORIGINAL"){
            targetProduct = allTitleContents.nth(i);
        }
    }

    console.log(await targetProduct.textContent());

    const allTitles = await allTitleContents.allTextContents();
    console.log(allTitles);
    await expect(page.locator("[style*='uppercase']").first()).toContainText('ZARA');


});
