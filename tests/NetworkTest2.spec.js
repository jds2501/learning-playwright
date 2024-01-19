const { test, expect } = require('@playwright/test');


test('Security test request intercept', async ({ page }) => {
    // Login
    const email = "descript.linking@gmail.com";
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("Lindy123$");
    await page.locator("#login").click();

    // Wait for page to load
    const allTitleContents = page.locator(".card-body");
    await allTitleContents.last().waitFor();

    await page.locator("[routerlink='/dashboard/myorders']").click();

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route => route.continue({ url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621" }));
    await page.locator("button:has-text('View')").first().click();
    await expect(page.locator("p[class='blink_me']")).toContainText("You are not authorize to view this order")
});