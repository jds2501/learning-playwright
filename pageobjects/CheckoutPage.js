const { OrderThanksPage } = require('./OrderThanksPage');

class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.shippingEmail = page.locator("[style='color: lightgray; font-weight: 600;']");
        this.productName = page.locator(".item__title");
        this.productQuantity = page.locator(".item__quantity");
        this.shippingCountry = page.locator("[placeholder='Select Country']");
        this.couponText = page.locator("[name='coupon']");
        this.submitCoupon = page.locator("button[type='submit']");
        this.couponApplied = page.locator(".mt-1.ng-star-inserted");
        this.placeOrderButton = page.locator(".btnn.action__submit.ng-star-inserted");
    }

    async getShippingEmail() {
        return await this.shippingEmail.textContent();
    }

    async verifyProductAndQuantity(productName, quantity) {
        return ((await this.productName.textContent()).includes(productName)) &&
            ((await this.productQuantity.textContent()).includes(quantity));
    }

    async selectShippingCountry(country) {
        await this.shippingCountry.pressSequentially(country);
        const prepopulatedList = this.page.locator(".ta-item");
        await prepopulatedList.last().waitFor();
        const regex = new RegExp(`.*${country}$`);
        await prepopulatedList.getByText(regex).click();
    }

    async applyCoupon(coupon) {
        await this.couponText.fill(coupon);
        await this.submitCoupon.click();
        return (await this.couponApplied.textContent()).includes("Coupon Applied");
    }

    async placeOrder() {
        await this.placeOrderButton.click();
        return new OrderThanksPage(this.page);
    }
}

module.exports = { CheckoutPage };