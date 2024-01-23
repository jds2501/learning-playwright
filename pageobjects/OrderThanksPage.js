const { MyOrdersPage } = require('./MyOrdersPage');

class OrderThanksPage {
    constructor(page) {
        this.page = page;
        this.orderThankYou = page.locator(".hero-primary");
        this.orderID = page.locator("label[class='ng-star-inserted']");
        this.myOrders = page.locator("label[routerlink='/dashboard/myorders']");
    }

    async verifyThankYou () {
        return (await this.orderThankYou.textContent()).includes("Thankyou for the order.");
    }

    async getOrderID () {
        const orderIDText = await this.orderID.textContent();
        return orderIDText.match(/[a-z0-9]+/);
    }

    async openOrderHistoryPage () {
        await this.myOrders.click();
        return new MyOrdersPage(this.page);
    }
}

module.exports = {OrderThanksPage};