const {test, expect} = require('@playwright/test');

test('@Web Browser Context Playwright test', async ({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    //page.route('**/*.{jpg,png,jpeg}', route=> route.abort());
    const username = page.locator('#username');
    const signInBtn = page.locator("#signInBtn");
    const cardTitles = page.locator(".card-body a");

    page.on('request', request => console.log(request.url()));
    page.on('response', response => console.log(response.url(), response.status()));

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title());
    await username.fill("rahulshetty");
    await page.locator("[type='password']").fill("learning");
    await signInBtn.click();
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');

    await username.fill("");
    await username.fill("rahulshettyacademy");
    await signInBtn.click()

    console.log(await cardTitles.first().textContent());
    console.log(await cardTitles.nth(1).textContent());
    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);
});



test('@Web UI Controls', async ({page})=>
{
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const username = page.locator('#username');
    const signInBtn = page.locator("#signInBtn");
    const dropdown =  page.locator("select.form-control");
    const userType = page.locator(".radiotextsty").last();
    const terms = page.locator("#terms");
    const documentLink = page.locator("[href*='documents-request']");

    await dropdown.selectOption("consult");
    await userType.click();
    await page.locator("#okayBtn").click();
    console.log(await userType.isChecked());
    await expect(userType).toBeChecked();

    await terms.click();
    await expect(terms).toBeChecked();
    await terms.uncheck();
    expect(await terms.isChecked()).toBeFalsy();

    await expect(documentLink).toHaveAttribute('class', 'blinkingText');
});

test('Child window handling', async ({browser})=>
{
    const context = await browser.newContext();
    const loginPage = await context.newPage();
    const username = loginPage.locator('#username');

    await loginPage.goto("https://rahulshettyacademy.com/loginpagePractise/");

    const documentLink = loginPage.locator("[href*='documents-request']");

    // promise: Pending (in progress), Rejected (error), Fulfilled (complete)
    // Execute all promises until both are fulfilled
    const [newPage] = await Promise.all(
    [
        context.waitForEvent('page'),
        documentLink.click()
    ]);

    const text = await newPage.locator('.im-para.red').textContent();
    const arrayText = text.split("@");
    const domain = arrayText[1].split(" ")[0];
    console.log(domain);

    await username.fill(domain);
    console.log(await username.textContent());
});
