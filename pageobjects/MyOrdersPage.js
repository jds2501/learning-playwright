const { OrderSummaryPage } = require('./OrderSummaryPage');

class MyOrdersPage {
    constructor(page) {
        this.page = page;
        this.orderHistoryRows = page.locator("tbody .ng-star-inserted");
        this.orderHistoryIDs = page.locator("[scope='row']");
    }

    async getOrderIDIndex (order) {
        await this.orderHistoryRows.last().waitFor();
        const idTextList = await this.orderHistoryIDs.allTextContents();
        return idTextList.indexOf(order);
    }

    async viewOrder (order) {
        const orderID = await this.getOrderIDIndex(order);
        await this.orderHistoryRows.nth(orderID).locator(".btn.btn-primary").click();
        return new OrderSummaryPage(this.page);
    }
}

module.exports = {MyOrdersPage};