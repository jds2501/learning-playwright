class CheckoutPage {
    constructor(page) {
        this.shippingEmail = page.locator("[style='color: lightgray; font-weight: 600;']");
        this.productName = page.locator(".item__title");
        this.productQuantity = page.locator(".item__quantity");
        this.shippingCountry = page.locator("[placeholder='Select Country']");
        this.couponText = page.locator("[name='coupon']");
        this.applyCoupon = page.locator("button[type='submit']");
        this.couponApplied = page.locator(".mt-1.ng-star-inserted");
        this.placeOrder = page.locator(".btnn.action__submit.ng-star-inserted");
    }

    async getShippingEmail() {
        return await this.shippingEmail.textContent();
    }

    async verifyProductAndQuantity(productName, quantity) {
        return ((await this.productName.textContent()).includes(productName)) &&
            ((await this.productQuantity.textContent()).includes(quantity));
    }
}

module.exports = { CheckoutPage };