const { CartPage } = require("./CartPage");
const { CheckoutPage } = require("./CheckoutPage");
const { DashboardPage } = require("./DashboardPage");
const { LoginPage } = require("./LoginPage");
const { MyOrdersPage } = require("./MyOrdersPage");
const { OrderSummaryPage } = require("./OrderSummaryPage");
const { OrderThanksPage } = require("./OrderThanksPage");

class POManager {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.dashboardPage = new DashboardPage(page);
        this.cartPage = new CartPage(page);
        this.checkoutPage = new CheckoutPage(page);
        this.orderThanksPage = new OrderThanksPage(page);
        this.orderSummaryPage = new OrderSummaryPage(page);
        this.myOrdersPage = new MyOrdersPage(page);
    }

    getLoginPage() {
        return this.loginPage;
    }

    getDashboardPage() {
        return this.dashboardPage;
    }

    getCartPage() {
        return this.cartPage;
    }

    getCheckoutPage() {
        return this.checkoutPage;
    }

    getOrderThanksPage() {
        return this.orderThanksPage;
    }

    getOrderSummaryPage() {
        return this.orderSummaryPage;
    }

    getMyOrdersPage() {
        return this.myOrdersPage;
    }
}

module.exports = { POManager };