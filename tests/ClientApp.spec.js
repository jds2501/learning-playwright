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
    await page.goto("https://rahulshettyacademy.com/client");

    await page.locator("#userEmail").fill("descript.linking@gmail.com");
    await page.locator("#userPassword").fill("Lindy123$");
    await page.locator("#login").click();

    // Discouraged: await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();

    const allTitles = await page.locator(".card-body b").allTextContents();
    console.log(allTitles);

    await expect(page.locator("[style*='uppercase']").first()).toContainText('ZARA');
});
