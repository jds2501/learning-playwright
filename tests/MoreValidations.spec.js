const {test, expect} = require('@playwright/test');

test('Popup validations', async ({page})=>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    //await page.goto("http://google.com");
    //await page.goBack();
    //await page.goForward();
    const displayedText = page.locator("#displayed-text");
    await expect(displayedText).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(displayedText).toBeHidden();
    page.on('dialog', dialog => dialog.accept());
    await page.locator("#confirmbtn").click();
    await page.locator("#mousehover").hover();
});