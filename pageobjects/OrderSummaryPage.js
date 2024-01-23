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

    async verifyBillingDeliveryAddressText() {
        return ((await this.orderSummaryAddresses.count() == 2) &&
            (await this.orderSummaryAddresses.nth(0).locator(".content-title").textContent()).includes("Billing Address") &&
            (await this.orderSummaryAddresses.nth(1).locator(".content-title").textContent()).includes("Delivery Address"));
    }
}

module.exports = { OrderSummaryPage };