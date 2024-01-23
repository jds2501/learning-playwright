const { CheckoutPage } = require('./CheckoutPage');

class CartPage {
    constructor(page) {
        this.page = page;
        this.productName = page.locator(".cartSection h3");
        this.checkoutButton = page.getByRole('button', { name: "Checkout"});
    }

    async getProductName() {
        return await this.productName.textContent();
    }

    async checkout() {
        await this.checkoutButton.click();
        return new CheckoutPage(this.page);
    }
}

module.exports = {CartPage};