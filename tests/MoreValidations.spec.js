const {test, expect} = require('@playwright/test');

test.describe.configure({mode: "serial"});

test('@Web Popup validations', async ({page})=>
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
    const framesPage = page.frameLocator("#courses-iframe");
    await framesPage.locator("li a[href='lifetime-access']:visible").click();
    const textCheck = await framesPage.locator(".text h2").textContent();
    console.log(textCheck.split(" ")[1]);
});

test('Screenshot & Visual Comparison', async ({page})=>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    const displayedText = page.locator("#displayed-text");
    await expect(displayedText).toBeVisible();
    await displayedText.screenshot({path: 'displayedText.png'});
    await page.locator("#hide-textbox").click();
    await page.screenshot({path: 'fullpage.png'});
    await expect(displayedText).toBeHidden();
});

/*
test('visual', async ({ page }) => {
    await page.goto("https://www.google.com/");
    expect(await page.screenshot()).toMatchSnapshot('landing.png');
});
*/

