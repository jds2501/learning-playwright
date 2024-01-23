class OrderSummaryPage {
    constructor(page) {
        this.page = page;
        this.orderID = page.locator(".col-text.-main");
        this.productName = page.locator(".title");
        this.orderSummaryAddresses = page.locator(".address");
    }

    async verifyOrderID(order) {
        return (await this.orderID.textContent()).includes(order);
    }

    async verifyProductName(productName) {
        return (await this.productName.textContent()).includes(productName);
    }

    async verifyBillingDeliveryAddressDefaultText() {
        return ((await this.orderSummaryAddresses.count() == 2) &&
            (await this.orderSummaryAddresses.nth(0).locator(".content-title").textContent()).includes("Billing Address") &&
            (await this.orderSummaryAddresses.nth(1).locator(".content-title").textContent()).includes("Delivery Address"));
    }

    async verifyAddresses(username, countryName) {
        let verified = this.verifyBillingDeliveryAddressDefaultText();

        for (let i = 0; verified && i < 2; i++) {
            const emailCountry = this.orderSummaryAddresses.nth(i).locator(".text");
            verified = (await emailCountry.count()) == 2 &&
                (await emailCountry.nth(0).textContent()).includes(username) &&
                (await emailCountry.nth(1).textContent()).includes(countryName);
        }

        return verified;
    }
}

module.exports = { OrderSummaryPage };